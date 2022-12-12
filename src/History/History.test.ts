import { History } from "..";

const testDataA = {
  id: "id-a",
  data: {
    objects: ["hello A"],
  },
};

const testDataB = {
  id: "id-b",
  data: {
    objects: ["hello B"],
  },
};

const testDataC = {
  id: "id-c",
  data: {
    objects: ["hello C"],
  },
};

describe("initial history without initial value.", () => {
  let history: History<{ objects: any[] }>;

  beforeEach(() => {
    history = new History();
  });

  it("initial correctly.", () => {
    expect(history.size).toEqual(0);
    expect(history.isBeginning).toEqual(true);
    expect(history.isEnding).toEqual(true);
    expect(history.pointer).toEqual(0);
  });

  it("history record add correctly.", () => {
    history.add(testDataA.id, testDataA.data);

    expect(history.size).toEqual(1);
    expect(history.isBeginning).toEqual(true);
    expect(history.isEnding).toEqual(true);
    expect(history.pointer).toEqual(0);
    expect(history.currentRecord).toEqual(testDataA);
  });

  it("history roam correctly.", () => {
    history.add(testDataA.id, testDataA.data);
    history.add(testDataB.id, testDataB.data);

    expect(history.pointer).toEqual(1);
    expect(history.size).toEqual(2);
    expect(history.isBeginning).toEqual(false);
    expect(history.isEnding).toEqual(true);
    expect(history.currentRecord).toEqual(testDataB);
    history.roam(0);
    expect(history.isBeginning).toEqual(true);
    expect(history.isEnding).toEqual(false);
    expect(history.pointer).toEqual(0);
    expect(history.currentRecord).toEqual(testDataA);
    history.roam("NEXT");
    expect(history.currentRecord).toEqual(testDataB);
    history.roam("PREV");
    expect(history.currentRecord).toEqual(testDataA);
  });

  it("history roam illegally.", () => {
    expect(history.currentRecord).toEqual(null);
    expect(history.roam(4)).toEqual(null);
    expect(history.roam("PREV")).toEqual(null);
    expect(history.roam("NEXT")).toEqual(null);
    expect(history.currentRecord).toEqual(null);
  });
});

describe("initial history with initial value.", () => {
  let history: History<{ objects: any[] }>;

  beforeEach(() => {
    history = new History(testDataA);
  });

  it("initial correctly.", () => {
    expect(history.size).toEqual(1);
    expect(history.isBeginning).toEqual(true);
    expect(history.isEnding).toEqual(true);
    expect(history.pointer).toEqual(0);
  });

  it("history record add correctly.", () => {
    history.add(testDataB.id, testDataB.data);

    expect(history.size).toEqual(2);
    expect(history.pointer).toEqual(1);
    expect(history.isBeginning).toEqual(false);
    expect(history.isEnding).toEqual(true);
    expect(history.currentRecord).toEqual(testDataB);
  });

  it("history roam correctly.", () => {
    history.add(testDataB.id, testDataB.data);

    expect(history.size).toEqual(2);
    expect(history.pointer).toEqual(1);
    expect(history.isBeginning).toEqual(false);
    expect(history.isEnding).toEqual(true);
    expect(history.currentRecord).toEqual(testDataB);
    history.roam(0);
    expect(history.isBeginning).toEqual(true);
    expect(history.isEnding).toEqual(false);
    expect(history.pointer).toEqual(0);
    expect(history.currentRecord).toEqual(testDataA);
    history.roam("NEXT");
    expect(history.currentRecord).toEqual(testDataB);
    history.roam("PREV");
    expect(history.currentRecord).toEqual(testDataA);

    history.add(testDataC.id, testDataC.data);
    expect(history.currentRecord).toEqual(testDataC);
    expect(history.size).toEqual(2);
    expect(history.isBeginning).toEqual(false);
    expect(history.isEnding).toEqual(true);
  });

  it("history roam illegally.", () => {
    expect(history.currentRecord).toEqual(testDataA);
    expect(history.roam(4)).toEqual(null);
    expect(history.roam("PREV")).toEqual(null);
    expect(history.roam("NEXT")).toEqual(null);
    expect(history.currentRecord).toEqual(testDataA);
  });

  it("history clear.", () => {
    history.clear();
    expect(history.isBeginning).toEqual(true);
    expect(history.isEnding).toEqual(true);
    expect(history.currentRecord).toEqual(null);
  });
});
