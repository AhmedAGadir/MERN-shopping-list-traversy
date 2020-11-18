import React, { Component } from 'react';
import {
    Container,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';

import PropTypes from 'prop-types';

class ShoppingList extends Component {
    // state = {
    //     items: [
    //         { id: uuidv4(), name: 'The Lies of Locke Lamora' },
    //         { id: uuidv4(), name: 'The Name of the Wind' },
    //         { id: uuidv4(), name: 'Frankenstein' },
    //     ]
    // }

    componentDidMount() {
        this.props.getItems();
    }

    // addItem = () => {
    // const name = prompt('Enter Item');
    // if (name) {
    //     this.setState(state => ({
    //         items: [
    //             ...state.items,
    //             { id: uuidv4(), name }
    //         ]
    //     }))
    // }
    //}

    removeItem = id => {
        this.props.deleteItem(id);
    }

    render() {
        const { items } = this.props.item;

        return (
            <Container>
                {/* <Button
                    color='dark'
                    style={{ marginBottom: '2rem' }}
                    onClick={this.addItem}>Add Item</Button> */}

                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {items.map(({ _id, name }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    {this.props.isAuthenticated ?
                                        <Button
                                            className="remove-btn"
                                            color="danger"
                                            size="sm"
                                            onClick={() => this.removeItem(_id)}
                                        >&times;</Button>
                                        : null}
                                    {name}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        )
    }
}

ShoppingList.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { getItems, deleteItem })(ShoppingList);