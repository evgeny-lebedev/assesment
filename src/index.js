import * as Clone from "../Clone/root";
import classes from "./index.css";

// const items = [
//   "Item One",
//   "Item Two",
//   "Item Three",
//   "Item Four",
//   "Item Five",
//   "Item Six",
// ];

class App extends Clone.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsCount: Math.floor(Math.random() * 6) + 1,
    }
  }

  removeItem() {
    this.setState({
      itemsCount: this.state.itemsCount - 1
    })
  }

  appendItem() {
    this.setState({
      itemsCount: this.state.itemsCount + 1
    })
  }

  render() {
    const items = this.props.items.map((item, index) => {
      if (index <= this.state.itemsCount) {
        return Clone.createElement(
          'li',
          {
            key: item,
          },
          item
        )
      } else {
        return null;
      }
    });
    // const z = this.props.items.map((item, index) => (
    //   index < this.state.itemsCount
    //     ? Clone.createElement(
    //     ListItem,
    //     {
    //       key: item,
    //       itemsCount: this.state.itemsCount,
    //       item,
    //     },
    //     item,
    //     ) : null)
    // );


    return Clone.createElement(
      'div',
      {},
      Clone.createElement(
        'h1',
        {},
        `Items in list below: ${this.state.itemsCount}`
      ),
      Clone.createElement(
        'button',
        {
          onClick: () => this.removeItem(),
        },
        "Remove one item"
      ),
      Clone.createElement(
        'button',
        {
          onClick: () => this.appendItem(),
        },
        "Append one item"
      ),
      Clone.createElement(
        'ul',
        {},
        items,
        Clone.createElement(
          'li',
          {},
          'Static List Item'
        ),
      )
    );
  }
}

class ListItem extends Clone.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: Math.ceil(Math.random() * 100),
    };
  }

  plus() {
    this.setState({
      counter: this.state.counter + 1,
    }, () => console.log("Callback called"));
  }

  subtractItemsCount() {
    this.setState((state, props) => {
      return { counter: state.counter - props.itemsCount };
    })
  }

  render() {
    return Clone.createElement(
      'li',
      {
        className: classes.listItem,
      },
      Clone.createElement(
        'span',
        {
          className: classes.itemText,
          style: {
            color: "#1641ed",
          }
        },
        `${this.props.item} - ${this.state.counter}`
      ),
      Clone.createElement(
        'button',
        {
          onClick: () => this.subtractItemsCount(),
        },
        'Subtract items count',
      ),
      Clone.createElement(
        'button',
        {
          onClick: () => this.plus(),
        },
        "Plus one",
      ),
    );
  }
}

Clone.render(
  Clone.createElement(
    App,
    {
      items: new Array(8)
        .fill({})
        .map((elem, index) => `Item ${index}`)
    },
  ),
  document.getElementById("root")
);

