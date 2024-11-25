import { InputDungeon, DGNode, Room, RoomId } from "../types";

export function parseInputDungeon(dungeon: InputDungeon): DGNode<Room> {
  return createRoomNode(dungeon, "start");
}

function createRoomNode(dungeon: InputDungeon, roomId: RoomId): DGNode<Room> {
  const room = dungeon[roomId];
  if (!room) {
    throw new Error(`Could not find "${roomId}" to generate tree.`);
  }

  const node = new DGNode<Room>({
    id: room.id,
    type: room.type,
  });

  room.children.map((item) => {
    const childNode = createRoomNode(dungeon, item);
    node.addChild(childNode);
  });

  return node;
}
