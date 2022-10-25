import React, { Component } from "react"
import "./Select.css"

// referencing this neat zero-dependency multi-select
// https://codepen.io/CrocoDillon/pen/MpMoZe
export default class Select extends Component {
  constructor(props) {
    super(props)

    this.state = {
      values: [],
      focusedValue: -1,
      isFocused: false,
      isOpen: false,
      typed: "",
    }

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)

    this.onClick = this.onClick.bind(this)
    this.onDeleteOption = this.onDeleteOption.bind(this)
    this.onHoverOption = this.onHoverOption.bind(this)
    this.onClickOption = this.onClickOption.bind(this)

    this.renderOption = this.renderOption.bind(this)
  }

  onFocus() {
    this.setState({
      isFocused: true,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.values.length !== prevState.values.length) {
      this.props.onValuesChange(this.state.values)
    }
  }

  onBlur() {
    const { options, multiple } = this.props

    this.setState((prevState) => {
      const { values } = prevState

      if (multiple) {
        return {
          focusedValue: -1,
          isFocused: false,
          isOpen: false,
        }
      } else {
        const value = values[0]

        let focusedValue = -1

        if (value) {
          focusedValue = options.findIndex((option) => option.value === value)
        }

        return {
          focusedValue,
          isFocused: false,
          isOpen: false,
        }
      }
    })
  }

  onKeyDown(e) {
    const { options, multiple } = this.props
    const { isOpen } = this.state

    switch (e.key) {
      case " ":
        e.preventDefault()
        if (isOpen) {
          if (multiple) {
            this.setState((prevState) => {
              const { focusedValue } = prevState

              if (focusedValue !== -1) {
                const [...values] = prevState.values
                const value = options[focusedValue].value
                const index = values.indexOf(value)

                if (index === -1) {
                  values.push(value)
                } else {
                  values.splice(index, 1)
                }
                return { values }
              }
            })
          }
        } else {
          this.setState({
            isOpen: true,
          })
        }
        break
      case "Escape":
      case "Tab":
        if (isOpen) {
          e.preventDefault()
          this.setState({
            isOpen: false,
          })
        }
        break
      case "Enter":
        this.setState((prevState) => ({
          isOpen: !prevState.isOpen,
        }))
        break
      case "ArrowDown":
        e.preventDefault()
        this.setState((prevState) => {
          let { focusedValue } = prevState

          if (focusedValue < options.length - 1) {
            focusedValue++

            if (multiple) {
              return {
                focusedValue,
              }
            } else {
              return {
                values: [options[focusedValue].value],
                focusedValue,
              }
            }
          }
        })
        break
      case "ArrowUp":
        e.preventDefault()
        this.setState((prevState) => {
          let { focusedValue } = prevState

          if (focusedValue > 0) {
            focusedValue--

            if (multiple) {
              return {
                focusedValue,
              }
            } else {
              return {
                values: [options[focusedValue].value],
                focusedValue,
              }
            }
          }
        })
        break
      default:
        if (/^[a-z0-9]$/i.test(e.key)) {
          const char = e.key

          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.setState({
              typed: "",
            })
          }, 1000)

          this.setState((prevState) => {
            const typed = prevState.typed + char
            const re = new RegExp(`^${typed}`, "i")
            const index = options.findIndex((option) => re.test(option.value))

            if (index === -1) {
              return {
                typed,
              }
            }

            if (multiple) {
              return {
                focusedValue: index,
                typed,
              }
            } else {
              return {
                values: [options[index].value],
                focusedValue: index,
                typed,
              }
            }
          })
        }
        break
    }
  }

  onClick() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }))
  }

  onDeleteOption(e) {
    const { value } = e.currentTarget.dataset

    this.setState((prevState) => {
      const [...values] = prevState.values
      const index = values.indexOf(value)

      values.splice(index, 1)

      return { values }
    })
  }

  onHoverOption(e) {
    const { options } = this.props

    const { value } = e.currentTarget.dataset
    const index = options.findIndex((option) => option.value === value)

    this.setState({
      focusedValue: index,
    })
  }

  onClickOption(e) {
    const { multiple } = this.props

    const { value } = e.currentTarget.dataset

    this.setState((prevState) => {
      if (!multiple) {
        return {
          values: [value],
          isOpen: false,
        }
      }

      const [...values] = prevState.values
      const index = values.indexOf(value)

      if (index === -1) {
        values.push(value)
      } else {
        values.splice(index, 1)
      }

      return { values }
    })
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  renderValues() {
    const { placeholder, multiple } = this.props
    const { values } = this.state

    if (values.length === 0) {
      return <div className="placeholder">{placeholder}</div>
    }

    if (multiple) {
      return values.map((value) => {
        return (
          <span
            key={value}
            onClick={this.stopPropagation}
            className="multiple value"
          >
            {value}
            <span
              data-value={value}
              onClick={this.onDeleteOption}
              className="delete"
            >
              <X />
            </span>
          </span>
        )
      })
    }

    return <div className="value">{values[0]}</div>
  }

  renderOptions() {
    const { options } = this.props
    const { isOpen } = this.state

    if (!isOpen) {
      return null
    }

    return <div className="options">{options.map(this.renderOption)}</div>
  }

  renderOption(option, index) {
    const { multiple } = this.props
    const { values, focusedValue } = this.state

    const { value } = option

    const selected = values.includes(value)

    let className = "option"
    if (selected) className += " selected"
    if (index === focusedValue) className += " focused"

    return (
      <div
        key={value}
        data-value={value}
        className={className}
        onMouseOver={this.onHoverOption}
        onClick={this.onClickOption}
      >
        {multiple ? (
          <span className="checkbox">{selected ? <Check /> : null}</span>
        ) : null}
        {value}
      </div>
    )
  }

  render() {
    const { label } = this.props
    const { isOpen } = this.state

    return (
      <div
        className="select"
        tabIndex="0"
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
      >
        <label className="label">{label}</label>
        <div className="selection" onClick={this.onClick}>
          {this.renderValues()}
          <span className="arrow">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </span>
        </div>
        {this.renderOptions()}
      </div>
    )
  }
}

const ChevronDown = () => (
  <svg viewBox="0 0 10 7">
    <path
      d="M2.08578644,6.5 C1.69526215,6.89052429 1.69526215,7.52368927 2.08578644,7.91421356 C2.47631073,8.30473785 3.10947571,8.30473785 3.5,7.91421356 L8.20710678,3.20710678 L3.5,-1.5 C3.10947571,-1.89052429 2.47631073,-1.89052429 2.08578644,-1.5 C1.69526215,-1.10947571 1.69526215,-0.476310729 2.08578644,-0.0857864376 L5.37867966,3.20710678 L2.08578644,6.5 Z"
      transform="translate(5.000000, 3.207107) rotate(90.000000) translate(-5.000000, -3.207107) "
    />
  </svg>
)

const ChevronUp = () => (
  <svg viewBox="0 0 10 8">
    <path
      d="M2.08578644,7.29289322 C1.69526215,7.68341751 1.69526215,8.31658249 2.08578644,8.70710678 C2.47631073,9.09763107 3.10947571,9.09763107 3.5,8.70710678 L8.20710678,4 L3.5,-0.707106781 C3.10947571,-1.09763107 2.47631073,-1.09763107 2.08578644,-0.707106781 C1.69526215,-0.316582489 1.69526215,0.316582489 2.08578644,0.707106781 L5.37867966,4 L2.08578644,7.29289322 Z"
      transform="translate(5.000000, 4.000000) rotate(-90.000000) translate(-5.000000, -4.000000) "
    />
  </svg>
)

const X = () => (
  <svg viewBox="0 0 16 16">
    <path d="M2 .594l-1.406 1.406.688.719 5.281 5.281-5.281 5.281-.688.719 1.406 1.406.719-.688 5.281-5.281 5.281 5.281.719.688 1.406-1.406-.688-.719-5.281-5.281 5.281-5.281.688-.719-1.406-1.406-.719.688-5.281 5.281-5.281-5.281-.719-.688z" />
  </svg>
)

const Check = () => (
  <svg viewBox="0 0 16 16">
    <path
      d="M13 .156l-1.406 1.438-5.594 5.594-1.594-1.594-1.406-1.438-2.844 2.844 1.438 1.406 3 3 1.406 1.438 1.406-1.438 7-7 1.438-1.406-2.844-2.844z"
      transform="translate(0 1)"
    />
  </svg>
)
