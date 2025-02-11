<!--
 * @file Minimap.svelte
 * @author James Bennion-Pedley
 * @brief Corner 'Map component' in UI
 * @date 13/02/2023
 *
 * @copyright Copyright (c) 2023
 *
-->

<script lang="ts">
    /*-------------------------------- Imports -------------------------------*/

    import { createEventDispatcher } from "svelte";

    import type { NofloMinimap } from "$lib/types/Noflo";

    import MinimapNode from "$lib/components/MinimapNode.svelte";

    /*--------------------------------- Props --------------------------------*/

    export let key: string;
    export let d3Translate;
    export let store;

    export let location: NofloMinimap;

    const { nodesStore, widthStore, heightStore } = store;

    //placeholdervalues for initialization
    //dispatch for message to be sent
    const dispatch = createEventDispatcher();

    let mapMax = 100;
    let mapWidth = mapMax;
    let mapHeight = mapMax;
    let nodeHeight = mapMax - 10;
    let nodeWidth = mapMax - 10;
    let viewHeight = 10;
    let viewWidth = 10;
    let viewRight = 10;
    let viewBottom = 10;
    let heightRatio = 1;
    let widthRatio = 1;
    let nodeXleftPosition = Infinity;
    let nodeYtopPosition = -Infinity;
    let nodeYbottomPosition = Infinity;
    let nodeXrightPosition = -Infinity;
    let map; // y position within the element.
    let hasBeenClicked = false;
    const scaleW = (v) => v * (mapWidth / nodeWidth);
    const scaleH = (v) => v * (mapHeight / nodeHeight);

    /*-------------------------------- Methods -------------------------------*/

    function handleClick(event) {
        if (!hasBeenClicked) {
            //bounds grabs map variable coordinates on the map relative to the websites position
            let bounds = map.getBoundingClientRect();

            hasBeenClicked = true;
            dispatch("message", {
                x:
                    nodeXleftPosition +
                    (event.clientX - bounds.left) / widthRatio,
                y:
                    nodeYbottomPosition +
                    (event.clientY - bounds.top) / heightRatio,
            });
            //throttles clicks to prevent map distortion
            setTimeout(() => {
                hasBeenClicked = false;
            }, 500);
        }
    }

    /*------------------------------- Lifecycle ------------------------------*/

    $: {
        nodeXleftPosition = Infinity;
        nodeYtopPosition = -Infinity;
        nodeYbottomPosition = Infinity;
        nodeXrightPosition = -Infinity;

        // looks for the top-most, bottom-most, left-most, right-most values for the furthest node in those perspective values to find the boundaries of the size of the diagram
        Object.values($nodesStore).forEach((node) => {
            nodeXleftPosition = Math.min(nodeXleftPosition, node.positionX);
            nodeXrightPosition = Math.max(nodeXrightPosition, node.positionX);
            nodeYbottomPosition = Math.min(nodeYbottomPosition, node.positionY);
            nodeYtopPosition = Math.max(nodeYtopPosition, node.positionY);
        });
        // sets the height, width of nodes after movement
        nodeHeight = nodeYtopPosition - nodeYbottomPosition;
        nodeWidth = nodeXrightPosition - nodeXleftPosition;

        if (nodeHeight > nodeWidth) {
            mapHeight = 100;
            mapWidth = Math.max(
                (nodeWidth.toFixed(0) * 100) / nodeHeight.toFixed(0),
                25
            );
        } else if (nodeHeight < nodeWidth) {
            mapWidth = 100;
            mapHeight = Math.max(
                (nodeHeight.toFixed(0) * 100) / nodeWidth.toFixed(0),
                25
            );
        } else {
            mapHeight = 100;
            mapWidth = 100;
        }
        heightRatio = (mapHeight / nodeHeight).toFixed(2);
        widthRatio = (mapWidth / nodeWidth).toFixed(2);

        // determining the positioning and the size of the viewbox
        viewRight =
            scaleW(d3Translate.x * widthRatio - d3Translate.x / d3Translate.k) -
            nodeXleftPosition * widthRatio;
        viewBottom =
            scaleH(
                d3Translate.y * heightRatio - d3Translate.y / d3Translate.k
            ) -
            nodeYbottomPosition * heightRatio;

        viewWidth = ($widthStore * widthRatio) / d3Translate.k;
        viewHeight = ($heightStore * heightRatio) / d3Translate.k;
    }
</script>

<div
    class:top-left={location === "top-left"}
    class:top-right={location === "top-right"}
    class:bottom-left={location === "bottom-left"}
    class:bottom-right={location === "bottom-right"}
    on:click={handleClick}
    bind:this={map}
    class={`minimap minimap-${key}`}
    style="height:{mapHeight + 20}px; width:{mapWidth + 20}px;"
    on:keydown={() => {
        return;
    }}
>
    <div
        class="viewbox viewbox-{key}"
        style="height:{viewHeight}px; width:{viewWidth}px; top:{viewBottom}px; left:{viewRight}px;"
    />
    {#each Object.values($nodesStore) as node}
        <MinimapNode
            {node}
            {key}
            {heightRatio}
            {widthRatio}
            {nodeXleftPosition}
            {nodeYbottomPosition}
        />
    {/each}
</div>

<style>
    .minimap {
        height: 100px;
        width: 100px;
        background-color: rgb(237, 236, 236);
        border: solid black;
        border-width: 1px;
        border-radius: 0.5rem;
        color: rgb(142, 142, 142);
        position: absolute;
        z-index: 10;
        box-shadow: 2px 2px 7px rgb(77, 77, 77);
        overflow: hidden;
    }

    .viewbox {
        background-color: rgb(120, 120, 120);
        border: solid red 1px;
        position: absolute;
    }

    .top-left {
        top: 15px;
        left: 15px;
    }

    .top-right {
        top: 15px;
        right: 15px;
    }

    .bottom-left {
        bottom: 15px;
        left: 15px;
    }

    .bottom-right {
        bottom: 15px;
        right: 15px;
    }
</style>
