const Success = () => {

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >   
        Order has been created successfully<br />
        Successfull. Your order is being prepared...
      <button style={{ padding: 10, marginTop: 20 }}>Go to Homepage</button>
    </div>
  );
};

export default Success;