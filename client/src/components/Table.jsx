import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import style from "./Table.module.css";
import loading from "../assets/images/loading.svg";
//Take care of how this component stretches from the
//calling component
function Table({ isLoading, locks }) {
  const notEmpty = locks?.length > 0;
  return (
    <div className="locker-table">
      <TableHeader />
      {locks.map((lock, key) => {
        return <TableRow key={key} lock={lock} />;
      })}
      {isLoading && !notEmpty && (
        <div className={style.table_loading}>
          <TableRow />
          <TableRow />
          <TableRow />
          <TableRow />
          <div className={style.table_load}>
            <img className={style.loading_image} src={loading} alt="Loading" />
          </div>
        </div>
      )}
    </div>
  );
}
export default React.memo(Table);
