import { action, computed, makeObservable, observable } from "mobx";

type RecordItem<D> = { id: string; data: D };

export class History<RecordData = any> {
  // 当前history指针
  _pointer: number = 0;

  _history: RecordItem<RecordData>[];

  constructor(initHistory: RecordItem<RecordData> | string) {
    if (typeof initHistory === "string") {
      this._history = [
        {
          id: initHistory,
          data: {
            objects: [],
          } as RecordData,
        },
      ];
    } else {
      this._history = [initHistory];
    }

    makeObservable(this, {
      _history: observable.deep,
      _pointer: observable,
      pointer: computed,
      size: computed,
      isBeginning: computed,
      isEnding: computed,
      add: action,
      clear: action,
      currentRecord: computed,
      roam: action,
    });
  }

  get pointer() {
    return this._pointer;
  }

  set pointer(pointer: number) {
    // 指针设置不能小于0，或者大于历史记录长度
    if (pointer < 0 && pointer > this._history.length) {
      return;
    }

    this._pointer = pointer;
  }

  /**
   * 指针是否指向最开始Record
   */
  get isBeginning(): boolean {
    return this.pointer === 0;
  }

  /**
   * 指针是否指向最末尾Record
   */
  get isEnding() {
    return this.pointer === this._history.length - 1;
  }

  /**
   * Record的长度
   */
  get size() {
    return this._history.length;
  }

  /**
   * 当前的Record
   */
  get currentRecord() {
    return this._history[this.pointer] ?? null;
  }

  /**
   * History 漫游
   * @param pointer 需要移动到的 Record 的指针
   * @returns Boolean 失败返回flase 成功返回true
   */
  roam(pointer: number | "PREV" | "NEXT"): RecordItem<RecordData> | null {
    if (pointer === "PREV") {
      if (this.isBeginning) {
        return null;
      }
      this.pointer = this.pointer - 1;
      return this.currentRecord;
    }

    if (pointer === "NEXT") {
      if (this.isEnding) {
        return null;
      }
      this.pointer = this.pointer + 1;
      return this.currentRecord;
    }

    if (typeof pointer === "number") {
      this.pointer = pointer;
      return this.currentRecord;
    }

    return null;
  }

  /**
   * 新增记录
   *
   * @param renderId 当前Core的renderID
   * @param data 需要记录的 Record Data
   */
  add(renderId: string, data: RecordData) {
    // 如果history指针指向history最后一个record，则在其后添加一个新的record，并将指针指向新增的record
    if (this.isEnding) {
      this._history.push({
        id: renderId,
        data: { ...data },
      });
      this.pointer = this.pointer + 1;
    }

    // 否则删除当前指针之后的record，并在其后添加一个新的record，并将指针指向新增的record
    else {
      this._history.splice(this.pointer + 1, this.size - this.pointer, {
        id: renderId,
        data,
      });
      this.pointer = this.pointer + 1;
    }
  }

  /**
   * 清除Record列表
   */
  clear() {
    this._history = [];
  }
}
