//
// Generic
//
export type Vector2 = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Direction = "n" | "s" | "e" | "w";

//
// Tiles
//
export type Tile = number;
export type Tiles = number[][];

//
// Dungeon - Input value given to generate graph.
//
export type RoomId = string;
export type RoomType = "start" | "room" | "boss" | "end";

export type InputRoom = {
  id: RoomId;
  type: RoomType;
  children: RoomId[];
};

export type InputDungeon = {
  [roomId: RoomId]: InputRoom;
};

//
// Room
//
export type Corridor = {
  position: Vector2;
  dimensions: Dimensions;
};

export type Room = {
  id: RoomId;
  type: RoomType;
  dimensions?: Dimensions;
  position?: Vector2;
  /** A corridor leading to the node's parent. */
  corridor?: Corridor;
};

//
// Graph - Node data structure.
//
export class DGNode<T> {
  value: T;
  parent: DGNode<T> | null;
  children: DGNode<T>[];

  constructor(value: T, parent: DGNode<T> | null = null) {
    this.value = value;
    this.children = [];
    this.parent = parent;
  }

  public addChild(node: DGNode<T>) {
    node.parent = this;
    this.children.push(node);
  }

  public copyValue(): T {
    return {
      ...this.value,
    };
  }
}
