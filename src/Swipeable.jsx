import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Hammer from 'react-hammerjs'

const hammerOptions = {
	touchAction: 'pan-y',
	cssProps: {
		userSelect: ''
	},
	recognizers: {
		pan: {},
		tap: {
			time: 600,
			threshold: 100
		}
	}
}
export default class Swipeable extends Component {
	constructor(props) {
		super(props)

		this.state = {
			x: null,
			y: null,
			swiping: false,
			start: 0
		}
		this.touchStart = this.touchStart.bind(this)
		this.touchMove = this.touchMove.bind(this)
		this.touchEnd = this.touchEnd.bind(this)
		this.handleSwipe = this.handleSwipe.bind(this)

		this.handlePanStart = this.handlePanStart.bind(this)

		this.handlePanEnd = this.handlePanEnd.bind(this)
		this.handlePanCancel = this.handlePanCancel.bind(this)
		this.handlePan = this.handlePan.bind(this)
	}

	getInitialState() {
		return {
			x: null,
			y: null,
			swiping: false,
			start: 0
		}
	}

	calculatePos(e) {
		const x = e.changedTouches[0].clientX
		const y = e.changedTouches[0].clientY

		const xd = this.state.x - x
		const yd = this.state.y - y

		const axd = Math.abs(xd)
		const ayd = Math.abs(yd)

		return {
			deltaX: xd,
			deltaY: yd,
			absX: axd,
			absY: ayd
		}
	}

	handlePanStart(e) {
		this.setState({
			start: Date.now(),
			x: e.pointers[0].clientX,
			y: e.pointers[0].clientY,
			swiping: false
		})
	}

	touchStart(e) {
		if (e.touches.length > 1) {
			return
		}
		this.setState({
			start: Date.now(),
			x: e.touches[0].clientX,
			y: e.touches[0].clientY,
			swiping: false
		})
	}

	handleSwipe(e) {
		const direction = e.direction == 1 ? 'right' : 'left'
		console.log('handlingSwipe')
	}

	calculatePointers(e) {
		const x = e.changedPointers[0].clientX
		const y = e.changedPointers[0].clientY

		const xd = this.state.x - x
		const yd = this.state.y - y

		const axd = Math.abs(xd)
		const ayd = Math.abs(yd)

		return {
			deltaX: xd,
			deltaY: yd,
			absX: axd,
			absY: ayd
		}
	}

	handlePan(e) {
		const { x, y } = this.state
		const { delta, onSwipingLeft, onSwipingRight, onSwipingUp, onSwipingDown } = this.props

		if (!x || !y || e.pointers.length > 1) return

		let cancelPageSwipe = false

		const { absX, absY, deltaX, deltaY } = this.calculatePointers(e)

		if (absX < delta && absY < delta) {
			return
		}

		if (absX < delta && absY < delta) {
			return
		}

		if (absX > absY) {
			if (deltaX > 0) {
				if (onSwipingLeft) {
					onSwipingLeft(e, absX)
					cancelPageSwipe = true
				}
			} else if (onSwipingRight) {
				onSwipingRight(e, absX)
				cancelPageSwipe = true
			}
		} else if (deltaY > 0) {
			if (onSwipingUp) {
				onSwipingUp(e, absY)
				cancelPageSwipe = true
			}
		} else if (onSwipingDown) {
			onSwipingDown(e, absY)
			cancelPageSwipe = true
		}

		this.setState({ swiping: true })

		if (cancelPageSwipe) {
			// debugger;
			// e.preventDefault();
		}
	}

	touchMove(e) {
		const { x, y } = this.state
		const { delta, onSwipingLeft, onSwipingRight, onSwipingUp, onSwipingDown } = this.props
		if (!x || !y || e.touches.length > 1) {
			return
		}

		let cancelPageSwipe = false
		const { absX, absY, deltaX, deltaY } = this.calculatePos(e)

		if (absX < delta && absY < delta) {
			return
		}

		if (absX > absY) {
			if (deltaX > 0) {
				if (onSwipingLeft) {
					onSwipingLeft(e, absX)
					cancelPageSwipe = true
				}
			} else if (onSwipingRight) {
				onSwipingRight(e, absX)
				cancelPageSwipe = true
			}
		} else if (deltaY > 0) {
			if (onSwipingUp) {
				onSwipingUp(e, absY)
				cancelPageSwipe = true
			}
		} else if (onSwipingDown) {
			onSwipingDown(e, absY)
			cancelPageSwipe = true
		}

		this.setState({ swiping: true })

		if (cancelPageSwipe) {
			// debugger;
			// e.preventDefault();
		}
	}

	handlePanCancel(ev) {
		debugger
	}

	handlePanEnd(ev) {
		const { swiping, start } = this.state
		const { flickThreshold, onSwiped, onSwipedLeft, onSwipedRight, onSwipedUp, onSwipedDown } = this.props

		if (swiping) {
			const { absX, absY, deltaX, deltaY } = this.calculatePointers(ev)

			const time = Date.now() - start
			const velocity = Math.sqrt(absX * absX + absY * absY) / time
			const isFlick = velocity > flickThreshold

			onSwiped && onSwiped(ev, deltaX, deltaY, isFlick)

			if (absX > absY) {
				if (deltaX > 0) {
					onSwipedLeft && onSwipedLeft(ev, deltaX)
				} else {
					onSwipedRight && onSwipedRight(ev, deltaX)
				}
			} else if (deltaY > 0) {
				onSwipedUp && onSwipedUp(ev, deltaY)
			} else {
				onSwipedDown && onSwipedDown(ev, deltaY)
			}
		}

		this.setState(this.getInitialState())
	}

	touchEnd(ev) {
		const { swiping, start } = this.state
		const { flickThreshold, onSwiped, onSwipedLeft, onSwipedRight, onSwipedUp, onSwipedDown } = this.props
		if (swiping) {
			const pos = this.calculatePos(ev)

			const time = Date.now() - start
			const velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time
			const isFlick = velocity > flickThreshold

			onSwiped && onSwiped(ev, pos.deltaX, pos.deltaY, isFlick)

			if (pos.absX > pos.absY) {
				if (pos.deltaX > 0) {
					onSwipedLeft && onSwipedLeft(ev, pos.deltaX)
				} else {
					onSwipedRight && onSwipedRight(ev, pos.deltaX)
				}
			} else if (pos.deltaY > 0) {
				onSwipedUp && onSwipedUp(ev, pos.deltaY)
			} else {
				onSwipedDown && onSwipedDown(ev, pos.deltaY)
			}
		}

		this.setState(this.getInitialState())
	}

	render() {
		const props = Object.assign({}, this.props, {
			onPanMove: this.handlePanMove,
			onPanStart: this.handlePanStart,
			onPanLeft: this.handlePanMove,
			onPanRight: this.handlePanMove,
			onTouchStart: this.touchStart,
			onTouchMove: this.touchMove,
			onTouchEnd: this.touchEnd
		})

		const customPropNames = [
			'onSwiped',
			'onSwipingUp',
			'onSwipingRight',
			'onSwipingLeft',
			'onSwipedUp',
			'onSwipedRight',
			'onSwipedDown',
			'onSwipedLeft',
			'flickThreshold',
			'onPanStart',
			'onPanMove',
			'onPanLeft',
			'onPanRight',
			'delta'
		]
		for (const name of customPropNames) {
			delete props[name]
		}

		const options = {
			touchAction: 'compute',
			recognizers: {
				pan: {},
				tap: {
					time: 600,
					threshold: 100
				}
			}
		}

		return (
  <Hammer
    options={hammerOptions}
    onSwipe={this.handleSwipe}
    onSwipeLeft={this.onSwipeLeft}
    onSwipeRight={this.onSwipeRight}
    onPan={this.handlePan}
    onPanStart={this.handlePanStart}
    onPanEnd={this.handlePanEnd}
    onPanCancel={this.handlePanCancel}
			>
    <div {...props}>{this.props.children}</div>
  </Hammer>
		)
	}
}

Swipeable.propTypes = {
	delta: PropTypes.number,
	flickThreshold: PropTypes.number,
	onSwiped: PropTypes.func,
	onSwipedDown: PropTypes.func,
	onSwipedLeft: PropTypes.func,
	onSwipedRight: PropTypes.func,
	onSwipedUp: PropTypes.func,
	onSwipingDown: PropTypes.func,
	onSwipingLeft: PropTypes.func,
	onSwipingRight: PropTypes.func,
	onSwipingUp: PropTypes.func
}
Swipeable.defaultProps = {
	flickThreshold: 0.6,
	delta: 10,
	onSwiped: () => {},
	onSwipingUp: () => {},
	onSwipingRight: () => {},
	onSwipingLeft: () => {},
	onSwipedUp: () => {},
	onSwipedLeft: () => {},
	onSwipedRight: () => {}
}
