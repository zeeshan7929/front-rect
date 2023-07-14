import React from 'react'

function Header({ title, setSidebarOpen,rightElements }) {
  return (
<div className="col-12 topPart ">
  <div className="row h-100 mx-0 align-items-center">
    <div className="col-12 h-100 topPartnner">
      <div className="row h-100 align-items-center">
        <div className="col-auto menuIconBtn me-2 d-lg-none d-lg-block ps-0"
            onClick={() => setSidebarOpen("cgrid")}
        >
          <img src="../assets/img/svg/grid.svg" alt />
        </div>
        <div className="col-auto px-0">
          <div className="pageHeading">{title}</div>
        </div>

        <div className="col-auto px-0 mr-2" style={{flex:1,display:"flex",justifyContent:"flex-end"}}>
          {rightElements}
        </div>
      </div>

    </div>
  </div>
</div>

  )
}

export default Header