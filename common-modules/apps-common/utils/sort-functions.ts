export const QuickSortFunction = new class <T> {
    private aList: T[];
    swapFn: (v1: number, v2: number) => void;
    compareFn: (current: T, next: T) => boolean;

    sort(aList: T[], swapFun: (v1: number, v2: number) => void, compareFn: (current: T, next: T) => boolean) {
        this.aList = aList;
        this.swapFn = swapFun;
        this.compareFn = compareFn;
        this.quickSort(0, this.aList.length - 1);
        return this.aList;
    }
    private quickSort(left: number, right: number) {
        if (right - left <= 0) {
            return;
        } else {
            const pivot = this.aList[right];
            const splitPoint = this.partition(left, right, pivot);
            this.quickSort(left, splitPoint - 1);
            this.quickSort(splitPoint + 1, right);
        }
    }

    private partition(left: number, right: number, pivot) {
        let leftmark = left - 1;
        let rightmark = right;
        while (true) {
            while (this.compareFn(this.aList[++leftmark], pivot)) { }
            while (rightmark > 0 && !this.compareFn(this.aList[--rightmark], pivot)) { }
            if (rightmark <= leftmark) {
                break;
            } else {
                this.swapFn(leftmark, rightmark);
            }
        }

        this.swapFn(leftmark, right);
        return leftmark;
    }
};

export const SelectionSortFunction = new class <T> {
    private aList: T[];
    swapFn: (v1: number, v2: number) => void;
    compareFn: (current: T, next: T) => boolean;

    sort(aList: T[], swapFun: (v1: number, v2: number) => void, compareFn: (current: T, next: T) => boolean) {
        this.aList = aList;
        this.swapFn = swapFun;
        this.compareFn = compareFn;
        this.selectionSort();
        return this.aList;
    }
    private selectionSort() {
        let min;
        for (let outer = 0; outer <= this.aList.length - 2; outer++) {
            min = outer;
            for (let inner = outer + 1; inner <= this.aList.length - 1; inner++) {
                if (this.compareFn(this.aList[inner], this.aList[min])) {
                    min = inner;
                }
            }
            this.swapFn(outer, min);
        }
    }
};
