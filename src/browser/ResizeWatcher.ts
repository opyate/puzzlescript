import { _debounce } from '../util'

export default class ResizeWatcher {
    private readonly table: HTMLTableElement
    private readonly handler: (width: number, left: number) => void
    private readonly boundResizeHandler: any
    private columns: number
    private rows: number

    constructor(table: HTMLTableElement, handler: (width: number, left: number) => void) {
        this.table = table
        this.handler = handler
        this.columns = 1
        this.rows = 1
        this.boundResizeHandler = _debounce(this.trigger.bind(this))

        window.addEventListener('resize', this.boundResizeHandler)
    }

    public setLevel(rows: number, columns: number) {
        this.rows = rows
        this.columns = columns
    }

    public trigger() {
        // Resize the table so that it fits.
        const levelRatio = this.columns / this.rows
        // Figure out if the width or the height is the limiting factor
        const leftWithoutAutoMargins = this.leftWithoutAutoMargins()
        const availableWidth = Math.min(window.outerWidth, window.innerWidth) - leftWithoutAutoMargins
        const availableHeight = Math.min(window.outerHeight, window.innerHeight) - this.table.offsetTop
        let newWidth = 0
        if (availableWidth / levelRatio < availableHeight) {
            // Width is the limiting factor
            newWidth = Math.floor(availableWidth / this.columns / 5) * this.columns * 5
        } else {
            // Height is the limiting factor
            newWidth = Math.floor(availableHeight * levelRatio / this.rows / 5) * this.rows * 5
        }
        const leftOffset = availableWidth / 2 - newWidth / 2 - leftWithoutAutoMargins
        this.handler(Math.floor(newWidth), Math.floor(leftOffset))
    }

    public dispose() {
        window.removeEventListener('resize', this.boundResizeHandler)
    }

    private leftWithoutAutoMargins() {
        const originalLeft = this.table.offsetLeft
        const originalWidthStr = window.getComputedStyle(this.table).width
        const originalWidth = originalWidthStr ? Number.parseFloat(originalWidthStr.replace(/px$/, '')) : 0

        // check how much the offset moves by when we increase the width (to see if some parents are margin:auto;)
        this.table.style.width = `${originalLeft * 2 + originalWidth}px`
        const stretchedLeft = this.table.offsetLeft
        this.table.style.width = originalWidthStr
        return stretchedLeft
    }
}
