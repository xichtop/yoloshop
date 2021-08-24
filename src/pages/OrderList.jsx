import React, { Suspense} from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import HeaderOrderList from '../components/HeaderOrderList';
import RoutesOrderList from '../routes/RoutesOrderList';

function OrderList() {
  return (
    <div className="order-list">
      <Suspense fallback = {<div>Loading...</div>}>
        <BrowserRouter >
        <Route render={props => (
                <div>
                    <HeaderOrderList {...props}/>
                    <div className="container">
                        <div className="main">
                            <RoutesOrderList/>
                        </div>
                    </div>
                </div>
            )}/>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default OrderList;