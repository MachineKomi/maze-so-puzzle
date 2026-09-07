import {expect,it} from 'vitest';
import {UI_ART,resolveUiArt,selectArtRendition} from './art';

// Reviewed WALL-04C set. New field candidates need an explicit source/geometry
// review and contract change; adding a presentation record alone must fail CI.
const groups={
 friends:'bunny fox kitten puppy duckling hedgehog otter lamb alpaca penguin fawn red-panda capybara chinchilla koala pitter-patter-parasol lanternling emberdown-phoenix meadowstep-faunling minerva-moon-owl tessera-dolphin mallowmusk-aroma-wisp breezeling-sylph griffin-cub emberbelly-dragonling cloudstep-pegasus three-tumble-cerberus riddlekit-sphinx tidecurl-hippocamp ripplecap-kappa rainbow-horn-unicorn green-tea-skeleton',
 enemies:'blueberry-slime mushroom-imp moon-bat pebble-golem acorn-knight bubble-dragon candy-mimic cloud-gremlin pumpkin-sprite clockwork-crab jelly-sorcerer goblin',
 weapons:'star-sword flower-sabre moon-wand leaf-blade sun-mallet comet-spear bubble-ring-blade cupcake-mace',
 keys:'key-rose-heart key-sunny-sun key-blue-star',
 utilities:'splash-boots spring-boots antidote-leaf',
};
it('freezes the complete reviewed field-detail set and registered rendition tuples',()=>{
 const ids=Object.values(groups).flatMap(s=>s.split(' ')).sort();expect(ids).toHaveLength(58);
 expect(Object.fromEntries(Object.entries(groups).map(([k,s])=>[k,s.split(' ').length]))).toEqual({friends:32,enemies:12,weapons:8,keys:3,utilities:3});
 const eligible=UI_ART.filter(a=>selectArtRendition(a,'field',400,2,true).src!==a.src).map(a=>a.id).sort();
 expect(eligible).toEqual(ids);
 const tuples=ids.map(id=>{
  const a=resolveUiArt(id)!,small=selectArtRendition(a,'field',100,2,true),large=selectArtRendition(a,'field',200,2,true);
  expect(small.src).toBe(a.src);expect(large.src).not.toBe(a.src);expect(large.geometry?.class).toBe(a.geometry?.class);
  return {id,family:a.family,canonical:{src:a.src,geometry:a.geometry},detail:{src:large.src,geometry:large.geometry}};
 });
 // Exact paths + full geometry/socket metadata, not a snapshot of pixels or
 // a self-derived expectation. Future approved changes require review here.
 expect(tuples).toMatchSnapshot();
});
