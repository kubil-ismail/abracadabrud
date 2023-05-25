const usePaymentStatus = (status, isCancel) => {
  let labelStatus;
  let colorStatus;
  if (isCancel === 1) {
    labelStatus = 'Canceled';
    colorStatus = 'red';
  } else {
    switch (status) {
      case 1:
        labelStatus = 'Pending';
        colorStatus = 'orange';
        break;
      case 2:
        labelStatus = 'Success';
        colorStatus = 'green';
        break;
      case 3:
        labelStatus = 'Expired';
        colorStatus = 'red';
        break;
      case 4:
        labelStatus = 'Failed';
        colorStatus = 'red';
        break;
      case 5:
        labelStatus = 'Refund';
        colorStatus = 'cyan';
        break;
      default:
        labelStatus = 'Unpaid';
        colorStatus = 'orange';
        break;
    }
  }

  return {
    labelStatus,
    colorStatus
  };
};

export default usePaymentStatus;
