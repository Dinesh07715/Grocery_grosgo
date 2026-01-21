import { ORDER_STATUS_FLOW } from "../utils/orderStatusFlow"

const OrderStatusTimeline = ({ currentStatus, statusTimeline = {} }) => {
  // Normalize status to uppercase for comparison
  const normalizedStatus = (currentStatus || '').toUpperCase()
  const currentIndex = ORDER_STATUS_FLOW.map(s => s.toUpperCase()).indexOf(normalizedStatus)

  return (
    <div className="flex justify-between items-center mt-6">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const isCompleted = index <= currentIndex

        return (
          <div key={status} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}
              `}
            >
              {index + 1}
            </div>

            <p className={`mt-2 text-xs capitalize ${
              isCompleted ? "text-green-600 font-medium" : "text-gray-500"
            }`}>
              {status.replace("_", " ")}
            </p>
            {statusTimeline?.[status] && (
  <p className="text-[10px] text-gray-400 mt-1">
    {new Date(statusTimeline[status]).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>
)}


            {index !== ORDER_STATUS_FLOW.length - 1 && (
              <div
                className={`h-1 mt-2 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OrderStatusTimeline
