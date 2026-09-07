# v02213 20260907 Playtest Feedback

## Holes

Before we moved from working on this project on my old laptop to the new laptop you were working on implementing a new improved sprite for the holes in the ground in mazes - as well as for the ability to draw holes that covered multiple tiles but that are connected like a long hole or trench in various shapes and variable length vertical lines of holes horizontal lines of holes and + shaped and T shaped holes. You implemented the single hole rule as standard and you implemented the smooth camera hole jumping feature; but we never implemented the new hole sprite or the long trench functionality so please do that at some point or at least check to make sure its still on the back log to be implemented - you had a pretty nice looking proposal for it. - and we had a cool maze that used a vertical row of holes to great effect. I think that is the only time we should ever use multiple holes - when you are only allwed to jump across one hole at a time - so having multiple holes next to eachother in one long hole covering multiple tiles it can be used to create one way crossings so you can only cross in one direction not the other. 

## Chill, Walk Zippy

Reminder to implement the three movement speeds in the UI with icons for each. 

## Bug - maze selection results in maze looping

When you select a maze from the maze selection screen in the adventure book - when you clear that maze instead of taking you to the next maze in the story/campaign or taking you back to the maze selection menu it just loops the maze you are currently in - I think the most natural behaviour would be to take you to the next maze in the story - probably. Or maybe to give you the option to go to the next maze or to open the maze selection screen again or to go to a surprise maze or to stay here (in case you didn't actually want to leave yet for some reason.).

# v02214

## Floor hazard effects: 

Might be fixed by now but if not - the thick white dashed line animating along a curve is not an effective effect and doesn't make the texture look or feel like water. The texture should warp and deform on an animation or something or the texture should animate a little bit or some other effect. Currently it doesn't look like water or lava or poison at all, it just looks like a picture of water, lava and poison. We need some more interesting and appropriate and convincing effects to make those areas look like what they are meant to be. and maybe some kind of little splash effect when you walk on water, and maybe a hot orange red glow from below when you walk along lava? I don't know maybe some faint smoke effect rising from the lava? and a poison gas effect around the poison, and subtle rippling of the water? not sure but make it look good while keeping the game extremely performant and well optimized. 

## Potential regression in floor hazards

At some point in a previous build we had implemented transparency and fading around the edges of the lava water poison etc. So the floor hazard wouldn't go all the way to edge of the tile, there would be a lip of floor visible around the edges and they would fade out around those edges, this made them blend more naturally into the floor and not look as artificial. At some point at least on mobile that has been lost. I would like to see that re-implemented because that feels like a regression. This issue impacts PC and mobile - and was only regression impacted in the most recent build I think because I was testing on PC and refreshed and then it happened - I think I might know why because the effect doesn't seem to be working correctly with the wall shadow - the wall shadow needs to be drawn over the water and the fade out edge and lip. 