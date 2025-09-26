import React from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Item from "../../../Server/model/itemModel";

const OwnerItemCard = ({ data }) => {
    //Navigate 
    const navigate = useNavigate()
  return (
    <div
      className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#32CD32]
    w-full max-w-2xl"
    >
      <div className="w-36 h-full flex-shrink-0 bg-gray-50">
        <img src={data.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className="text-base font-semibold text-[#32CD32]">
            {data.name}
          </h2>
          <p>
            <span className="font-medium text-gray-70">Category:</span>{" "}
            {data.category}
          </p>
          <p>
            <span className="font-medium text-gray-70">Food Type:</span>{" "}
            {data.foodType}
          </p>
        </div>
        <div className="flex items-center justify-between">
            <div className="text-[#32CD32] font-bold">{data.price}</div>
            <div className="flex items-center gap-2">
                <div className="cursor-pointer p-2 rounded-full hover:bg-[#32CD32]/10 text-[#32CD32]"
                onClick={()=> navigate(`/edit-item/${data._id}`)}>
                    <FaPen size={16} />
                </div>
                <div className="cursor-pointer p-2 rounded-full hover:bg-[#32CD32]/10 text-[#32CD32]">
                    <FaTrash size={16} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
