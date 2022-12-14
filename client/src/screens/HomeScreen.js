import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import { getAllPizzas } from "../actions/pizzaAction";
import PizzaCard from "../components/PizzaCard";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Filters from "../components/Filters";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const pizzaState = useSelector((state) => state.getAllPizzaReducer);
  const { loading, pizzas, error } = pizzaState;

  useEffect(() => {
    dispatch(getAllPizzas());
  }, [dispatch]);
  return (
    <>
      <Container>
        {loading ? (
          <Loading />
        ) : error ? (
          <Error error="Something went wrong" />
        ) : (
          <Row>
            <Filters />
            {pizzas.map((pizza, index) => {
              return (
                <Col md={4} key={index}>
                  <PizzaCard pizza={pizza} />
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
