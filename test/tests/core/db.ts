import {J} from "../../utils";
import {Schema} from "mongoose";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressDBInitTests = () => J.utils.desc("AM DB Init",() => {
  let api:TestAppApi,
  dbName:string = "OBAExpressApi",
  model:any,id:any;
  const schema = new Schema({
    name:{type:String,unique:true,required:true,index:true},
    value:Number},{
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
  });
  schema.virtual("other").get(function(){return this.name + "-OtherShit"});
  J.utils.desc("DB",() => {
    it("init",async () => {
      api = (await J.utils.init("OBA_EXPRESS")).api;
      J.is(api);
      J.true(api.db);
    },1E9);
    it(`has connections`,async () => {
      await api.db.start();
      console.log(api.db);
      J.true(api.db.get(dbName));
    },1E9);
    it(`has "model" method`,async () => {
      model = await api.db.model(dbName,"TestModel",schema,"testmodels");
      J.prop(api.db.get(dbName).client.models,"TestModel");
    },1E9);
  });
  J.utils.desc("Mongoose Conn",() => {
    it(`create & save`,async () => {
      const m = new model({name:"Johnny"});
      J.is(m);
      J.is(m.name,"Johnny");
      J.is(m.other,"Johnny-OtherShit");
      await m.save();
      console.log(m.toJSON());
      id = m._id;
    },1e9);
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
      console.log({removed});
      J.is(removed.deletedCount,2);
    },1E9);
    //it(`db/mongoose shutdown on exit`,async () => events.send({shutdown:0}));
  });
});