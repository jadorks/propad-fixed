import React from "react";
//Give this component the names of the column via properties prop
function TableHeader({ properties }) {
  return (
    <div className="table-header">
      <h4 className="column">Type</h4>
      <h4 className="column">Symbol</h4>
      <h4 className="column">Locked On</h4>
      <h4 className="column">Amount</h4>
      <h4 className="column">Locked Value</h4>
      <h4 className="column">Unlocks in</h4>
      <h4 className="column">Lock Status</h4>
      <h4 className="column">Token</h4>
    </div>
  );
}

export default TableHeader;
