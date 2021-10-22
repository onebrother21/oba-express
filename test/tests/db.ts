import {J} from "../utils";
import mongoose,{Schema} from "mongoose";
import {OBACoreApi,OBACoreConfig,masterConfig} from "../../src";

export const obaCoreDBInitTests = () => J.desc("AM DB Init",() => {
  beforeAll(async () => {
    const db = await mongoose.createConnection("mongodb://localhost:27017/ob1",{useNewUrlParser:true,useUnifiedTopology:true});
    await db.dropDatabase();
  },1E9);
  let m:OBACoreApi<null>,c:OBACoreConfig,db:OBACoreApi<null>["db"],model:any,id:any;
  const schema = new Schema({
    name:{type:String,unique:true,required:true,index:true},
    value:Number},{
    toObject:{virtuals:true},
    toJSON:{virtuals:true}});
  schema.virtual("other").get(function(){return this.name + "OtherShit"});
  J.desc("DB",() => {
    it("init",async () => {
      c = masterConfig("OBA_CORE");
      m = new OBACoreApi({db:c.db});
      J.is(m);
      J.true(m.db);
      db = m.db},1E9);
    it(`has connections and "model" method`,async () => {
      await db.start();
      model = await db.model("OBA_CORE","TestModel",schema,"testmodels");
      J.true(db.get("OBA_CORE"));
      J.prop(db.get("OBA_CORE").client.models,"TestModel");
    },1E9);
  });
  J.desc("Mongoose Conn",() => {
    it(`create & save`,async () => {
      const m = new model({name:"Johnny"});
      J.is(m);
      J.is(m.name,"Johnny");
      J.is(m.other,"JohnnyOtherShit");
      await m.save();
      console.log(m.toJSON());
      id = m._id;},1e9);
    it(`fetch by id`,async () => {
      const m = await model.findById(id);
      J.is(m);},1E9);
    it(`fetch by unique field "name"`,async () => {
      const m = await model.findOne({name:"Johnny"});
      J.is(m);},1E9);
    it(`update & save`,async () => {
      const m = await model.findByIdAndUpdate(id,{name:"Jimmy",value:8},{new:true});
      J.is(m.name,"Jimmy");
      J.is(m.value,8);
      },1E9);
    it(`remove`,async () => {
      const removed = await model.findByIdAndRemove(id);
      J.is(removed);
      console.log(removed)},1E9);
    it(`create & save many`,async () => {
      const newOnes = [{name:"Johnny"},{name:"Jimmy"}];
      const m = await model.create(newOnes);
      J.is(m);
      J.gt(m.length,0);},1E9);
    it(`query (fetch many)`,async () => {
      const m = await model.find({name:/J/});
      console.log(m);
      J.is(m);
      J.gt(m.length,0)},1E9);
    it(`update many`,async () => {
      await model.updateMany({name:/J/},{value:5});
      const m = await model.findOne({name:/J/});
      J.is(m);
      J.is(m.value,5)},1E9);
    it(`remove many`,async () => {
      const removed = await model.deleteMany({name:/J/});
      console.log({removed:!!removed.ok,ct:removed.n});
      J.is(removed);
      J.is(removed.n,2);
      //console.log({removed:!!removed.ok,ct:removed.n});
    },1E9);
    //it(`db/mongoose shutdown on exit`,async () => events.send({shutdown:0}));
  });
});