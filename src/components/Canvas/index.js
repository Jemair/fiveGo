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

  // 绘制棋盘
  // 为提高性能 canvas版把棋盘和棋子分开绘制 棋盘仅在组件加载时绘制一次
  drawBoard = () => {
    const cvs = document.querySelector('#board')
    const ctx = cvs.getContext('2d')
    ctx.beginPath()
    for (let i = 1; i <= 10; i++) {
      ctx.moveTo(0, 32 * i + 30 * (i - 1))
      ctx.lineTo(620, 32 * i + 30 * (i - 1))
      ctx.moveTo(32 * i + 30 * (i - 1), 0)
      ctx.lineTo(32 * i + 30 * (i - 1), 620)
    }
    ctx.stroke()
  }

  // 绘制棋子
  // 每次落子时清空棋盘，循环当前落子数组，index为偶数画黑子
  drawChessman = () => {
    const { lastPos, currentRound } = this.props
    const { ctx } = this.state
    if (ctx === null) { return }
    ctx.clearRect(0, 0, 620, 620)
    for (const [index, value] of lastPos.entries()) {
      if (index > currentRound) { break }
      if (!Array.isArray(value)) { continue }
      const chess = [value[1] * 62 + 32, value[0] * 62 + 32]
      ctx.moveTo(...chess)
      ctx.beginPath()
      ctx.arc(...chess, 20, 0, 2 * Math.PI)
      ctx.fillStyle = index % 2 ? '#000' : '#fff'
      ctx.fill()
      ctx.stroke()
      if (index === currentRound) {
        ctx.font = '40px Georgia'
        ctx.fillStyle = '#f00'
        ctx.fillText('+', chess[0] - 12, chess[1] + 10)
      }
    }
  }

  handleClick = e => {
    const { cvs } = this.state
    if (e.target !== cvs) { return }
    // 根据点击位置相对于canvas位置 转换成相对于棋盘坐标 ~~操作符取整
    const pos = [~~(e.layerY / 31), ~~(e.layerX / 31)]
    this.props.play(pos)
  }

  render () {
    this.drawChessman()
    return (
      <div style={{ position: 'relative' }}>
        {/* canvas绘制时放大一倍 再由css缩小一半 */}
        <canvas id='board' width='620' height='620' style={{width: 310, height: 310}} />
        <canvas id='chessman' style={{ position: 'absolute', top: 0, left: 0, width: 310, height: 310 }} width='620' height='620' />
      </div>
    )
  }
}
