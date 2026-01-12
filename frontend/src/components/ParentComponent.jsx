import React, { useState } from 'react';
import CertificationDropdown from './components/CertificationDropdown';

const ParentComponent = () => {
  const [approvalCertification, setApprovalCertification] = useState([]);
  
  return (
    <div>
      <CertificationDropdown 
        approvalCertification={approvalCertification}
        setApprovalCertification={setApprovalCertification}
      />
      {/* Other components */}
    </div>
  );
};