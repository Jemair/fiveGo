import React from 'react'
import * as s from './index.scss'

const Chessman = ({ chessman, isLast }) => {
  const color = chessman === 0 ? 'black' : 'white'
  return <div className={`${s[color]} ${s.chessman}`}>{isLast && '+'}</div>
}

const Cell = ({ cell, pos, play, lastPos, currentRound }) => {
  const handleClick = () => {
    cell === null && play(pos)
  }
  let chessman = null
  let isLast = false
  lastPos.forEach((i, index) => {
    if (i === null || index > currentRound) { return }
    if (i[0] !== pos[0] || i[1] !== pos[1]) { return }
    chessman = index % 2 ? 0 : 1
    isLast = index === currentRound
  })
  return (
    <div className={s.cell} onClick={handleClick}>
      {chessman !== null && <Chessman chessman={chessman} isLast={isLast} />}
    </div>
  )
}

const Row = props => {
  const { rowIndex } = props
  return (
    <div className={s.row}>
      {Array(10).fill(null).map((i, index) => {
        return <Cell key={index} cell={i} {...props} pos={[rowIndex, index]} />
      })}
    </div>
  )
}

const Board = props => {
  return (
    <div className={s.board}>
      {Array(10).fill(null).map((i, index) => {
        return <Row key={index} row={i} rowIndex={index} {...props} />
      })}
    </div>
  )
}

export default Board
