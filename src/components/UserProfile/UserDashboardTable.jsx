import React from "react";
import "../../styles/userDashboardTable.scss";

const UserDashboardTable = ({ usersData = [] }) => {
  const handleViewUser = (wallet) => {
    console.log(`Viewing wallet: ${wallet}`);
    // Bạn có thể điều hướng đến /user/:wallet_address nếu muốn
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() === "active"
      ? "status-active"
      : "status-inactive";
  };

  // ✅ HÀM MỚI: Xử lý hiển thị Roles
  const renderRoles = (roles) => {
    if (!roles || roles.length === 0) {
      return <span className="no-role-text">No Roles</span>;
    }

    return roles.map((roleObj, index) => {
      const roleName = roleObj.role_type;

      // Áp dụng style đặc biệt cho vai trò 'individual' đã được xác minh
      const roleClass =
        roleName === "individual" && roleObj.status === "active"
          ? "role-tag verified-glow"
          : "role-tag default-role-tag";

      return (
        <span
          key={index}
          className={roleClass}
          title={`Status: ${roleObj.status}`}>
          {roleName.toUpperCase()}
        </span>
      );
    });
  };

  return (
    <div className="cyber-dashboard-container">
      <h1 className="dashboard-title">
        User Registry{" "}
        <span className="neon-accent">
          | Network Nodes ({usersData.length})
        </span>
      </h1>

      {/* Cột Roles giờ sẽ hiển thị các tag */}
      <div className="table-header">
        <div className="header-item address-col">Wallet Address</div>
        <div className="header-item role-col">Roles</div>
        <div className="header-item tx-col right-align">Last Login</div>
        <div className="header-item status-col center-align">Status</div>
        <div className="header-item action-col center-align">Action</div>
      </div>

      <div className="table-body">
        {usersData.map((user, i) => (
          <div
            key={i}
            className="table-row"
            onClick={() => handleViewUser(user.wallet_address)}>
            <div className="row-item address-col">
              <span className="address-glow">{user.wallet_address}</span>
            </div>

            {/* ✅ SỬ DỤNG HÀM MỚI */}
            <div className="row-item role-col roles-container">
              {renderRoles(user.roles)}
            </div>

            <div className="row-item tx-col right-align">
              {user.last_login_at
                ? new Date(user.last_login_at).toLocaleString()
                : "Never"}
            </div>
            <div
              className={`row-item status-col center-align ${getStatusClass(
                "Active"
              )}`}>
              <span className="status-dot"></span>
              Active
            </div>
            <div className="row-item action-col center-align">
              <button className="view-button">View</button>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <span className="pagination-text">
          Displaying {usersData.length} records
        </span>
      </div>
    </div>
  );
};

export default UserDashboardTable;
