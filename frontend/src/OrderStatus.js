import React from 'react';

const OrderStatus = ({ status }) => {
  // Define status types and their properties
  const statusTypes = {
    pending: {
      color: '#FEF9C3', // yellow-100
      borderColor: '#FDE047', // yellow-300
      text: 'Order received and pending confirmation',
      step: 1
    },
    confirmed: {
      color: '#DBEAFE', // blue-100
      borderColor: '#93C5FD', // blue-300
      text: 'Order confirmed by restaurant',
      step: 2
    },
    preparing: {
      color: '#F3E8FF', // purple-100
      borderColor: '#D8B4FE', // purple-300
      text: 'Your food is being prepared',
      step: 3
    },
    ready: {
      color: '#DCFCE7', // green-100
      borderColor: '#86EFAC', // green-300
      text: 'Ready for pickup/delivery',
      step: 4
    },
    delivered: {
      color: '#BBF7D0', // green-200
      borderColor: '#4ADE80', // green-400
      text: 'Order completed and delivered',
      step: 5
    },
    cancelled: {
      color: '#FEE2E2', // red-100
      borderColor: '#FCA5A5', // red-300
      text: 'Order has been cancelled',
      step: 0
    }
  };

  const currentStatus = statusTypes[status.toLowerCase()] || statusTypes.pending;
  const steps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

  const containerStyle = {
    maxWidth: '800px',
    margin: '1rem auto',
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: 'white',
  };

  const headerStyle = {
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e5e7eb',
  };

  const statusBoxStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    backgroundColor: currentStatus.color,
    border: `1px solid ${currentStatus.borderColor}`,
    marginBottom: '1.5rem',
  };

  const timelineContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginTop: '2rem',
    padding: '0 1rem',
  };

  const stepStyle = (isActive, isCurrentStep) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  });

  const circleStyle = (isActive, isCurrentStep) => ({
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: isActive ? '#22C55E' : '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    border: isCurrentStep ? '3px solid #93C5FD' : 'none',
  });

  const lineStyle = (isActive) => ({
    position: 'absolute',
    height: '2px',
    backgroundColor: isActive ? '#22C55E' : '#E5E7EB',
    top: '1rem',
    left: '0',
    right: '0',
    zIndex: 0,
  });

  const labelStyle = {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize',
  };

  const checkmarkStyle = {
    width: '1rem',
    height: '1rem',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Order Status</h2>
      </div>

      <div style={statusBoxStyle}>
        <p style={{ margin: 0, fontWeight: '500' }}>
          Status: {status.toUpperCase()}
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#4B5563' }}>
          {currentStatus.text}
        </p>
      </div>

      <div style={timelineContainerStyle}>
        {steps.map((step, index) => {
          const stepStatus = statusTypes[step];
          const isActive = currentStatus.step >= stepStatus.step;
          const isCurrentStep = status.toLowerCase() === step;

          return (
            <div key={step} style={stepStyle(isActive, isCurrentStep)}>
              <div style={circleStyle(isActive, isCurrentStep)}>
                {isActive && (
                  <svg style={checkmarkStyle} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div style={labelStyle}>{step}</div>
              {index < steps.length - 1 && (
                <div style={{
                  ...lineStyle(isActive),
                  width: 'calc(100% - 2rem)',
                  transform: 'translateX(50%)',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {status !== 'delivered' && status !== 'cancelled' && (
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4B5563' }}>
          Estimated completion time: 30-45 minutes
        </div>
      )}
    </div>
  );
};

export default OrderStatus;