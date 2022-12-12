import { action, computed, makeObservable, observable } from "mobx";

type RecordItem<D> = { id: string; data: D };

export class History<RecordData = any> {
  // 当前history指针
  _pointer: number = 0;

  _history: RecordItem<RecordData>[];

  constructor(initHistory?: RecordItem<RecordData>) {
    if (typeof initHistory === "undefined") {
      this._history = [];
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

  /**
   * Record的长度
   */
  get size() {
    return this._history.length;
  }

  get pointer() {
    return this._pointer;
  }

  private set pointer(pointer: number) {
    // 指针设置不能小于0，或者大于历史记录长度
    if (this.size === 0 || pointer < 0 || pointer > this.size) {
      return;
    }

    this._pointer = pointer;
  }

  /**
   * 指针是否指向最开始Record
   */
  get isBeginning(): boolean {
    return this.size === 0 || this.pointer === 0;
  }

  /**
   * 指针是否指向最末尾Record
   */
  get isEnding() {
    return this.size === 0 || this.pointer === this.size - 1;
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
      } else {
        this.pointer = this.pointer - 1;
        return this.currentRecord;
      }
    } else if (pointer === "NEXT") {
      if (this.isEnding) {
        return null;
      } else {
        this.pointer = this.pointer + 1;
        return this.currentRecord;
      }
    } else {
      this.pointer = pointer;

      if (this.size === 0 || pointer < 0 || pointer >= this.size - 1) {
        return null;
      } else {
        return this.currentRecord;
      }
    }
  }

  /**
   * 新增记录
   *
   * @param id 当前id
   * @param data 需要记录的 Record Data
   */
  add(id: string, data: RecordData) {
    // 如果history指针指向history最后一个record，则在其后添加一个新的record，并将指针指向新增的record
    if (this.isEnding) {
      if (this.size > 0) {
        this.pointer = this.pointer + 1;
      }

      this._history.push({
        id,
        data: { ...data },
      });
    }

    // 否则删除当前指针之后的record，并在其后添加一个新的record，并将指针指向新增的record
    else {
      this._history.splice(this.pointer + 1, this.size - this.pointer, {
        id,
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
    this.pointer = 0;
  }
}
