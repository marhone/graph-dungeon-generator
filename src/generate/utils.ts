import { Direction, DGNode, Room } from "../types";
import { traverseTree } from "../utils";
import { AABB } from "./collisions";

/**
 * Get a random integer between `min` and `max`.
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Randomly pick an item in `values`.
 */
export function randomChoice<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

/**
 * Clamp a value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Transform a Node<Room> to a bounding box.
 */
export function nodeRoomToAABB(node: DGNode<Room>): AABB {
  const box: AABB = {
    id: node.value.id,
    startX: node.value.position!.x,
    endX: node.value.position!.x + node.value.dimensions!.width,
    startY: node.value.position!.y,
    endY: node.value.position!.y + node.value.dimensions!.height,
  };

  return box;
}

/**
 * Normalize a node tree to avoid having negative positions.
 */
export function normalizePositions(rootNode: DGNode<Room>) {
  let lowestX = 0;
  let lowestY = 0;

  // Find lowest X and Y
  traverseTree((node) => {
    if (node.value.position!.x < lowestX) {
      lowestX = node.value.position!.x;
    }

    if (node.value.position!.y < lowestY) {
      lowestY = node.value.position!.y;
    }
  }, rootNode);

  // Offset all positions to avoid negative values
  traverseTree((node) => {
    node.value.position!.x += Math.abs(lowestX);
    node.value.position!.y += Math.abs(lowestY);

    if (node.value.corridor) {
      node.value.corridor.position.x += Math.abs(lowestX);
      node.value.corridor.position.y += Math.abs(lowestY);
    }
  }, rootNode);
}

/**
 * Compute the overlapping segment of two segments.
 */
export function computeOverlapSegment(
  seg1Start: number,
  seg1End: number,
  seg2Start: number,
  seg2End: number
): [number, number] | null {
  const startOverlap = Math.max(seg1Start, seg2Start);
  const endOverlap = Math.min(seg1End, seg2End);

  if (startOverlap > endOverlap) {
    // No overlap, segments are disjointed
    return null;
  } else {
    // Overlap segment exists
    return [startOverlap, endOverlap];
  }
}

/**
 * Compute the direction of a child relative to its parent.
 */
export function getChildDirection(parentBox: AABB, childBox: AABB): Direction {
  // North
  if (parentBox.startY >= childBox.endY) {
    return "n";
  }
  // South
  else if (parentBox.endY <= childBox.startY) {
    return "s";
  }
  // West
  else if (parentBox.startX >= childBox.endX) {
    return "w";
  }
  // East
  else if (parentBox.endX <= childBox.startX) {
    return "e";
  }

  throw new Error(
    `Could not determine child "${childBox.id}" direction against parent "${parentBox.id}".`
  );
}
