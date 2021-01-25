import ProductChart from "./component/productChart";
import SalesVariation from "./component/sales-variation";
import OrdersVariation from "./component/orders-variation";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
// Create a client
const queryClient = new QueryClient(); // Instance of QueryClient
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ProductChart />
        <hr></hr>
        <SalesVariation />
        <hr></hr>
        <OrdersVariation />
      </QueryClientProvider>
    </>
  );
}

export default App;
