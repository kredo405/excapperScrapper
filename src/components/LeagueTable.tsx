import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { LeagueTable as LeagueTableType } from "../types/statistics";

interface LeagueTableProps {
  tableData: LeagueTableType[];
}

const columns: TableProps<LeagueTableType>["columns"] = [
  {
    title: "М",
    dataIndex: "position",
    key: "position",
  },
  {
    title: "К",
    dataIndex: "team",
    key: "team",
    render: (text) => <a>{text.shortName}</a>,
  },
  {
    title: "В",
    dataIndex: "winTotal",
    key: "winTotal",
  },
  {
    title: "Н",
    dataIndex: "drawTotal",
    key: "drawTotal",
  },
  {
    title: "П",
    dataIndex: "lossTotal",
    key: "lossTotal",
  },
  {
    title: "Голы",
    dataIndex: "goalsTotal",
    key: "goalsTotal",
  },
];

const LeagueTable: React.FC<LeagueTableProps> = ({ tableData }) => {
  const data: LeagueTableType[] = tableData.map((item) => ({
    key: String(item.position),
    position: item.position,
    team: item.team,
    winTotal: item.winTotal,
    lossTotal: item.lossTotal,
    drawTotal: item.drawTotal,
    goalsTotal: item.goalsTotal,
  }));

  console.log(data);

  return (
    <>
      <h1 className="font-mono text-slate-700 font-semibold text-xl text-center py-3">
        Турнирная таблица
      </h1>
      <Table<LeagueTableType>
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default LeagueTable;
