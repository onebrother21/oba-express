import express from "express";
import { OBAExpressType } from "./types";
export declare const createApp: (api: OBAExpressType) => Promise<express.Express>;
