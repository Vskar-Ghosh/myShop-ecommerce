import React, { useEffect } from "react";
import Headers from "../components/Headers";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, redirect, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "../store/reducers/cardReducer";

const Card = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    card_products,
    card_products_count,
    shipping_fee,
    outOfStockProduct,
    price,
    buy_product_item,
    successMessage,
  } = useSelector((state) => state.card);
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/shipping", {
      state: {
        products: card_products,
        price: price,
        shipping_fee: shipping_fee,
        items: buy_product_item,
      },
    });
  };

  useEffect(() => {
    dispatch(get_card_products(userInfo.id));
  }, []);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(get_card_products(userInfo.id));
    }
  }, [successMessage]);

  const inc = (quantity, stock, cardId) => {
    const temp = quantity + 1;
    if (temp <= stock) {
      dispatch(quantity_inc(cardId));
    }
  };
  const dec = (quantity, cardId) => {
    const temp = quantity - 1;
    if (temp !== 0) {
      dispatch(quantity_dec(cardId));
    }
  };
  return (
    <div>
      <Headers />
      <section className=' bg-[url("http://localhost:3000/images/banner/card.jpg")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className=" absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className=" w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className=" flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className=" text-3xl font-bold">Shop.my</h2>
              <div className=" flex justify-center items-center gap-2 text-2xl w-full">
                <Link to="/">Home</Link>
                <span className=" pt-1">
                  <MdKeyboardArrowRight />
                </span>
                <span>Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-[#eeeeee]">
        <div className=" w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16">
          {card_products.length > 0 || outOfStockProduct.length > 0 ? (
            <div className=" flex flex-wrap">
              <div className=" w-[67%] md-lg:w-full">
                <div className=" pr-3 md-lg:pr-0">
                  <div className=" flex flex-col gap-3">
                    <div className=" bg-white p-4">
                      <h2 className=" text-md text-green-500 font-semibold ">
                        Stock Products
                        {card_products.length}
                      </h2>
                    </div>
                    {card_products.map((p, i) => (
                      <div className=" flex bg-white p-4 flex-col gap-2">
                        <div className=" flex justify-start items-center">
                          <h2 className=" text-md text-slate-600">
                            {p.shopName}
                          </h2>
                        </div>
                        {p.products.map((pt, i) => (
                          <div className=" w-full flex flex-wrap">
                            <div className=" flex sm:w-full gap-2 w-7/12">
                              <div className=" flex gap-2 justify-start items-center">
                                <img
                                  className=" w-[80px] h-[80px]"
                                  src={pt.productInfo.images[0]}
                                  alt="productImg"
                                />
                                <div>
                                  <h2 className=" text-md">
                                    {pt.productInfo.name}
                                  </h2>
                                  <span className=" text-sm">
                                    Brand : {pt.productInfo.brand}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className=" w-5/12 flex justify-between sm:w-full sm:mt-3">
                              <div className=" pl-4 sm:pl-0">
                                <h2 className=" text-lg text-orange-500">
                                  $
                                  {pt.productInfo.price -
                                    Math.floor(
                                      (pt.productInfo.price *
                                        pt.productInfo.discount) /
                                        100
                                    )}
                                </h2>
                                <p className=" line-through">
                                  ${pt.productInfo.price}
                                </p>
                                <p>-{pt.productInfo.discount}%</p>
                              </div>
                              <div className=" flex gap-2 flex-col">
                                <div className=" bg-slate-200 flex h-[30px] justify-center items-center text-xl">
                                  <div
                                    onClick={() => dec(pt.quantity, pt._id)}
                                    className=" px-3 cursor-pointer"
                                  >
                                    -
                                  </div>
                                  <div className=" px-3">{pt.quantity}</div>
                                  <div
                                    onClick={() =>
                                      inc(
                                        pt.quantity,
                                        pt.productInfo.stock,
                                        pt._id
                                      )
                                    }
                                    className=" px-3 cursor-pointer"
                                  >
                                    +
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    dispatch(delete_card_product(pt._id))
                                  }
                                  className=" px-5 py-1 bg-red-500 text-white"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    {outOfStockProduct.length > 0 && (
                      <div className=" flex flex-col gap-3">
                        <div className=" bg-white p-4">
                          <h2 className=" text-md text-red-500 font-semibold ">
                            Out of Stock
                            {outOfStockProduct.length}
                          </h2>
                        </div>
                        <div className=" bg-white p-4">
                          {outOfStockProduct.map((op, i) => (
                            <div className=" w-full flex flex-wrap">
                              <div className=" flex sm:w-full gap-2 w-7/12">
                                <div className=" flex gap-2 justify-start items-center">
                                  <img
                                    className=" w-[80px] h-[80px]"
                                    src={op.products[0].images[0]}
                                    alt="productImg"
                                  />
                                  <div>
                                    <h2 className=" text-md">
                                      {op.products[0].name}
                                    </h2>
                                    <span className=" text-sm">
                                      Brand : {op.products[0].brand}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className=" w-5/12 flex justify-between sm:w-full sm:mt-3">
                                <div className=" pl-4 sm:pl-0">
                                  <h2 className=" text-lg text-orange-500">
                                    $
                                    {op.products[0].price -
                                      Math.floor(
                                        (op.products[0].price *
                                          op.products[0].discount) /
                                          100
                                      )}
                                  </h2>
                                  <p className=" line-through">
                                    ${op.products[0].price}
                                  </p>
                                  <p>-{op.products[0].discount}%</p>
                                </div>
                                <div className=" flex gap-2 flex-col">
                                  <div className=" bg-slate-200 flex h-[30px] justify-center items-center text-xl">
                                    <div
                                      onClick={() => dec(op.quantity, op._id)}
                                      className=" px-3 cursor-pointer"
                                    >
                                      -
                                    </div>
                                    <div className=" px-3">{op.quantity}</div>
                                    <div
                                      onClick={() =>
                                        inc(
                                          op.quantity,
                                          op.products.stock,
                                          op._id
                                        )
                                      }
                                      className=" px-3 cursor-pointer"
                                    >
                                      +
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      dispatch(delete_card_product(op._id))
                                    }
                                    className=" px-5 py-1 bg-red-500 text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" w-[33%] md-lg:w-full">
                <div className=" pl-3 md-lg:pl-0 md-lg:mt-5">
                  {card_products.length > 0 && (
                    <div className="  bg-white p-3 text-slate-600 flex flex-col gap-3">
                      <h2 className=" text-xl font-bold">Order Summery</h2>
                      <div className=" flex justify-between items-center">
                        <span>{buy_product_item} Item</span>
                        <span>${price}</span>
                      </div>
                      <div className=" flex justify-between items-center">
                        <span>shipping Fee</span>
                        <span>${shipping_fee}</span>
                      </div>
                      <div className=" flex gap-2">
                        <input
                          className=" w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm"
                          type="text"
                          placeholder="input voucher coupon"
                        />
                        <button className=" px-5 py-[1px] bg-blue-500 text-white rounded-sm uppercase text-sm">
                          Apply
                        </button>
                      </div>
                      <div className=" flex justify-between items-center">
                        <span>Total</span>
                        <span className=" text-lg text-orange-500">
                          ${price + shipping_fee}
                        </span>
                      </div>
                      <button
                        onClick={redirect}
                        className=" px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-sm text-white uppercase"
                      >
                        Procced to checkout {buy_product_item}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link className=" px-4 py-1 bg-indigo-500 text-white" to="/shops">
                shop Now
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Card;
