/**
 * 类型确认气泡
 * 当用户输入的值是无引号非纯数字内容时弹出
 */
export default function TypeBubble({ value, onSelect }) {
  return (
    <div className="bubble-enter absolute left-0 top-full mt-1 z-50 bg-[#FF7D00] text-white rounded-xl p-3 shadow-xl text-sm w-max max-w-xs">
      <p className="mb-2 font-semibold text-white">
        「{value}」是什么类型？
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSelect('text')}
          className="bg-white text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        >
          文本（自动加双引号）
        </button>
        <button
          onClick={() => onSelect('formula')}
          className="bg-white text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        >
          单元格/公式（保留原样）
        </button>
      </div>
    </div>
  )
}
