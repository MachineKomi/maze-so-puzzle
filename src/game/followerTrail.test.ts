import { describe, expect, it } from "vitest";
import { advanceFollowerProcession, createFollowerProcession, followerTargets, MAX_FOLLOWER_TRAIL_LENGTH, recordFollowerStep } from "./followerTrail";

describe("rescued friend procession",()=>{
  it("retains repeated visits and bounds long histories",()=>{
    const trail=[{x:2,y:3},{x:3,y:3},{x:3,y:4}];
    expect(recordFollowerStep(trail,{x:3,y:3})).toEqual([{x:3,y:3},...trail]);
    expect(recordFollowerStep(Array.from({length:40},(_,x)=>({x,y:1})),{x:40,y:1})).toHaveLength(MAX_FOLLOWER_TRAIL_LENGTH);
  });
  it("appends sorted engine IDs without moving an existing friend's slot",()=>{
    let train=createFollowerProcession({x:1,y:1},["zebra"]);
    train=advanceFollowerProcession(train,{x:2,y:1},["alpaca","zebra"]);
    expect(train.slots.map(s=>s.id)).toEqual(["zebra","alpaca"]);
    expect(followerTargets(train)).toEqual([{id:"zebra",point:{x:1,y:1}},{id:"alpaca",point:{x:2,y:1}}]);
  });
  it("follows the same corridor off camera through loops and reversal",()=>{
    let train=createFollowerProcession({x:0,y:0},["a","b","c","d","e"]);
    const route=[{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2},{x:1,y:2},{x:1,y:1},{x:2,y:1},{x:1,y:1}];
    for(const point of route) {
      const before=followerTargets(train);
      train=advanceFollowerProcession(train,point,["a","b","c","d","e"]);
      followerTargets(train).forEach((target,index)=>{
        const last=before[index]!.point;
        expect(Math.abs(target.point.x-last.x)+Math.abs(target.point.y-last.y)).toBeLessThanOrEqual(1);
      });
    }
    expect(followerTargets(train).map(t=>t.point)).toEqual(route.slice(-6,-1).reverse());
  });
  it("gathers at resume/landing without inventing a route across walls",()=>{
    let train=createFollowerProcession({x:1,y:1},["a","b"]);
    train=advanceFollowerProcession(train,{x:20,y:12},["a","b"],true);
    expect(followerTargets(train).every(t=>t.point.x===20&&t.point.y===12)).toBe(true);
    train=advanceFollowerProcession(train,{x:20,y:13},["a","b"]);
    expect(followerTargets(train).map(t=>t.point)).toEqual([{x:20,y:12},{x:20,y:12}]);
    expect(followerTargets(createFollowerProcession({x:0,y:0}))).toEqual([]);
  });
});
