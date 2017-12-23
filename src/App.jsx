import React, { Component } from 'react'
import Board from './components/Board'
import Canvas from './components/Canvas'
import { List } from 'immutable'

export default class App extends Component {
  constructor () {
    super()
    const row = List(Array(10).fill(null))
    const data = List(Array(10).fill(row))
    this.state = {
      initData: List.of(data), // 初始棋盘
      data: List.of(data),     // 每回合棋盘状态
      currentPlayer: 0,        // 当前玩家
      currentRound: 0,         // 当前回合数
      maxRound: 0,             // 最大回合数
      lastPos: List.of(null),  // 每回合落子记录
      hasWinner: false,        // 是否产生胜者 若为是则冻结棋盘
      version: 0               // 游戏版本 0为DOM版 1为canvas版
    }
  }

  componentWillUpdate (props, state) {
    const { lastPos, data, currentRound } = state
    const { currentPlayer } = this.state
    if (lastPos.size <= 1) {
      return
    }
    // 胜利判定
    if (this.isWin(lastPos.get(currentRound), data.get(currentRound), currentPlayer) === true) {
      const player = currentPlayer === 0 ? '黑方' : '白方'
      this.setState({ hasWinner: true })
      alert(player + '胜利！')
    }
  }

  /**
   * 落子
   * @param pos: Array 落子位置
   */
  play = pos => {
    const { data, currentRound, currentPlayer, hasWinner } = this.state
    const currentData = List(data.get(currentRound))
    if (currentData.get(pos[0]).get(pos[1]) !== null) { return }
    if (hasWinner) { return }

    const newData = currentData.set(pos[0], currentData.get(pos[0]).set(pos[1], currentPlayer))
    this.setState(prevState => {
      const { currentRound, data, lastPos } = prevState
      return ({
        data: data.slice(0, currentRound + 1).push(newData),
        currentPlayer: +!prevState.currentPlayer,
        currentRound: prevState.currentRound + 1,
        maxRound: prevState.currentRound + 1,
        lastPos: lastPos.slice(0, currentRound + 1).push(pos)
      })
    })
  }

  undo = () => {
    this.setState(prevState => ({
      currentRound: prevState.currentRound - 1,
      currentPlayer: +!prevState.currentPlayer,
      hasWinner: false
    }))
  }

  redo = () => {
    this.setState(prevState => ({
      currentRound: prevState.currentRound + 1,
      currentPlayer: +!prevState.currentPlayer
    }))
  }

  restart = () => {
    this.setState(prevState => ({
      currentRound: 0,
      maxRound: 0,
      currentPlayer: 0,
      hasWinner: false,
      lastPos: List.of(null),
      data: prevState.initData
    }))
  }

  /**
   * 胜负判定
   * @param pos: Array 最后落子位置
   * @param currentData: List 当前棋盘布局
   * @param currentPlayer: Number 当前玩家
   * @returns {boolean} 是否产生胜者
   */
  isWin = (pos, currentData, currentPlayer) => {
    if (pos === null) { return }
    // 测试数组 从最后落子位置出发 分别从横向 纵向 斜向x2 四个方向查找最大同色棋子
    // 其中任意方向同色棋子数达到4颗则判定为胜利✌️
    const testArray = [[[0, 1], [0, -1]], [[1, 0], [-1, 0]], [[1, 1], [-1, -1]], [[1, -1], [-1, 1]]]
    return testArray.some(i => {
      const max = i.reduce((m, n) => {
        let count = 0
        let tmp = [...pos]
        while (1) {
          tmp = [tmp[0] + n[0], tmp[1] + n[1]]
          if (tmp[0] < 0 || tmp[0] > 9 || tmp[1] < 0 || tmp[1] > 9) {
            break
          }
          const test = currentData.get(tmp[0]).get(tmp[1])
          if (test !== currentPlayer) {
            break
          }
          count++
        }
        return m + count
      }, 0)
      return max >= 4
    })
  }

  changeVersion = () => {
    this.setState(prev => ({
      version: +!prev.version
    }))
  }

  render () {
    const { data, currentRound, lastPos, currentPlayer, maxRound, version } = this.state
    return (
      <div>
        <button onClick={this.changeVersion}>Switch to {version === 0 ? 'canvas' : 'DOM'} version</button>
        {
          version === 0
            ? <Board data={data.get(currentRound)} play={this.play} lastPos={lastPos.get(currentRound - maxRound - 1)} />
            : <Canvas pos={lastPos} currentRound={currentRound} play={this.play} />
        }
        <p>Current player: {currentPlayer ? 'White' : 'Black'}</p>
        <p>Current round: {currentRound}</p>
        <p>
          <button onClick={this.undo} disabled={currentRound === 0}>undo</button>
          <button onClick={this.redo} disabled={maxRound <= currentRound}>redo</button>
          <button onClick={this.restart}>restart</button>
        </p>
      </div>
    )
  }
}
