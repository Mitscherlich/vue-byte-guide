import { Guide } from './components'
import type {
  ContentType, IGuide, IStep, Placement, SelectorType,
} from './typings/guide'

/** import global styles */
import './styles/index.css'

export type {
  IGuide, IStep, SelectorType, ContentType, Placement,
}
export default Guide

export * from './constants/className'
