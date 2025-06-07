import React from "react";
import StyledLink from "../buttons/StyledLink";

interface ResourceTableItem {
  label: string;
  value: string[];
  link?: string[];
}

interface ResourceTableProps {
  data: ResourceTableItem[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({ data }) => {
  return (
    <div className="flex justify-center select-text">
      <div className="w-full max-w-full md:max-w-[768px] bg-background rounded-lg p-4 mx-4 border border-text">
        <table className="table-fixed w-full">
          <colgroup>
            <col className="w-1/2" />
            <col className="w-1/2" />
          </colgroup>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`bg-background border-text ${
                  index < data.length - 1 ? "border-b" : ""
                }`}
              >
                <td className="p-2 text-center font-medium break-all">
                  {item.label}
                </td>
                <td className="p-2 text-center border-l border-text break-all">
                  <div className="flex flex-col space-y-1">
                    {item.value.map((val, i) => (
                      <div key={i}>
                        {item.link && item.link[i] ? (
                          <StyledLink url={item.link[i]} label={val} />
                        ) : (
                          val
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
