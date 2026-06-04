export interface Block {
  id?: string
  _order?: number
  blockType: string
  [key: string]: unknown
}
