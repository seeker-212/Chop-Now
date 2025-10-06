import React from "react";

const UserCartOrder = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b border-gray-400 pb-2">
        <div>
          <p className="font-semibold">Order #{data._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            {data.paymentMethod?.toUpperCase()}
          </p>
          <p className="font-medium text-blue-500">
            {data.shopOrders?.[0].status}
          </p>
        </div>
      </div>
      {data.shopOrders.map((shopOrder, index) => (
        <div
          className="border border-gray-200 rounded bg-[#fffaf7] space-y-3"
          key={index}
        >
          <p>{shopOrder.shop.name}</p>

          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder.shopOrderItem.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 border border-gray-400 rounded-lg p-2 bg-white"
              >
                <img
                  src={item.item.image}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-sm font-semibold mt-1">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ₦{item.price} x Qty: {item.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">Subtotal: ₦{shopOrder.subtotal}</p>
            <span className="text-sm font-medium text-blue-600">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">Total: ₦{data.totalAmount}</p>
        <button className="bg-[#32CD32] hover:bg-[#2ab12a] text-white px-4 py-2 rounded-lg text-sm">
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserCartOrder;
