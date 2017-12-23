import React, { Component } from 'react'

export default class Canvas extends Component {
  state = {
    cvs: null,
    ctx: null
  }

  componentDidMount () {
    this.drawBoard()
    const cvs = document.querySelector('#chessman')
    const ctx = cvs.getContext('2d')
    this.setState({
      cvs,
      ctx
    })
    document.addEventListener('click', this.handleClick)
  }
  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick)
  }

  drawBoard = () => {
    const cvs = document.querySelector('#board')
    const ctx = cvs.getContext('2d')
    ctx.beginPath()
    for (let i = 1; i <= 10; i++) {
      ctx.moveTo(0, 16 * i + 15 * (i - 1))
      ctx.lineTo(310, 16 * i + 15 * (i - 1))
      ctx.moveTo(16 * i + 15 * (i - 1), 0)
      ctx.lineTo(16 * i + 15 * (i - 1), 310)
    }
    ctx.stroke()
  }

  drawChessman = () => {
    const { pos, currentRound } = this.props
    const { ctx } = this.state
    if (ctx === null) { return }
    ctx.clearRect(0, 0, 310, 310)
    for (const [index, value] of pos.entries()) {
      if (index > currentRound) { break }
      if (!Array.isArray(value)) { continue }
      const chess = [value[1] * 31 + 16, value[0] * 31 + 16]
      ctx.moveTo(...chess)
      ctx.beginPath()
      ctx.arc(...chess, 10, 0, 2 * Math.PI)
      ctx.fillStyle = index % 2 ? '#000' : '#fff'
      ctx.fill()
      ctx.stroke()
      if (index === currentRound) {
        ctx.font = '20px Georgia'
        ctx.fillStyle = '#f00'
        ctx.fillText('+', chess[0] - 6, chess[1] + 5)
      }
    }
  }

  handleClick = e => {
    const { cvs } = this.state
    if (e.target !== cvs) { return }
    const pos = [~~(e.layerY / 30), ~~(e.layerX / 30)]
    this.props.play(pos)
  }

  render () {
    this.drawChessman()
    return (
      <div style={{ position: 'relative' }}>
        <canvas id='board' width='310' height='310' />
        <canvas id='chessman' style={{ position: 'absolute', top: 0, left: 0 }} width='310' height='310' />
      </div>
    )
  }
}
