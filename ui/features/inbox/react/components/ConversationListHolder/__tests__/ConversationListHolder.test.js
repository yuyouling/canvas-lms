/*
 * Copyright (C) 2020 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {render, fireEvent} from '@testing-library/react'
import React from 'react'
import {responsiveQuerySizes} from '../../../../util/utils'
import {ConversationListHolder} from '../ConversationListHolder'

const props = {
  conversations: [
    {
      _id: '1',
      workflowState: 'unread',
      conversation: {
        subject: 'This is the subject line',
        conversationParticipantsConnection: {
          nodes: [
            {user: {name: 'Bob Barker'}},
            {user: {name: 'Sally Ford'}},
            {user: {name: 'Russel Franks'}}
          ]
        },
        conversationMessagesConnection: {
          nodes: [
            {
              author: {name: 'Bob Barker'},
              conversationParticipantsConnection: {
                nodes: [
                  [
                    {user: {name: 'Bob Barker'}},
                    {user: {name: 'Sally Ford'}},
                    {user: {name: 'Russel Franks'}}
                  ]
                ]
              },
              createdAt: 'November 5, 2020 at 2:25pm',
              body: 'This is the body text for the message.'
            },
            {
              author: {name: 'Sally Ford'},
              conversationParticipantsConnection: {
                nodes: [
                  {user: {name: 'Sally Ford'}},
                  {user: {name: 'Bob Barker'}},
                  {user: {name: 'Russel Franks'}}
                ]
              },
              createdAt: 'November 4, 2020 at 2:25pm',
              body: 'This is the body text for the message.'
            }
          ]
        }
      }
    },
    {
      _id: '2',
      workflowState: 'read',
      conversation: {
        subject: 'This is a different subject line',
        conversationParticipantsConnection: {
          nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
        },
        conversationMessagesConnection: {
          nodes: [
            {
              author: {name: 'Todd Martin'},
              conversationParticipantsConnection: {
                nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
              },
              createdAt: 'November 3, 2020 at 8:58am',
              body: 'This conversation has a much longer body which should be too long to completely display.'
            }
          ]
        }
      }
    },
    {
      _id: '3',
      workflowState: 'unread',
      conversation: {
        subject: 'This is a different subject line also',
        conversationParticipantsConnection: {
          nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
        },
        starred: true,
        conversationMessagesConnection: {
          nodes: [
            {
              author: {name: 'Todd Martin'},
              conversationParticipantsConnection: {
                nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
              },
              createdAt: 'November 3, 2020 at 8:58am',
              body: 'This conversation has a much longer body which should be too long to completely display.'
            }
          ]
        }
      }
    },
    {
      _id: '4',
      workflowState: 'unread',
      conversation: {
        subject: 'This is a different subject line also',
        conversationParticipantsConnection: {
          nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
        },
        starred: true,
        conversationMessagesConnection: {
          nodes: [
            {
              author: {name: 'Todd Martin'},
              conversationParticipantsConnection: {
                nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
              },
              createdAt: 'November 3, 2020 at 8:58am',
              body: 'This conversation has a much longer body which should be too long to completely display.'
            }
          ]
        }
      }
    },
    {
      _id: '5',
      workflowState: 'unread',
      conversation: {
        subject: 'This is a different subject line also',
        conversationParticipantsConnection: {
          nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
        },
        starred: true,
        conversationMessagesConnection: {
          nodes: [
            {
              author: {name: 'Todd Martin'},
              conversationParticipantsConnection: {
                nodes: [{user: {name: 'Todd Martin'}}, {user: {name: 'Jim Thompson'}}]
              },
              createdAt: 'November 3, 2020 at 8:58am',
              body: 'This conversation has a much longer body which should be too long to completely display.'
            }
          ]
        }
      }
    }
  ]
}

jest.mock('../../../../util/utils', () => ({
  ...jest.requireActual('../../../../util/utils'),
  responsiveQuerySizes: jest.fn()
}))

describe('ConversationListHolder', () => {
  beforeAll(() => {
    // Add appropriate mocks for responsive
    window.matchMedia = jest.fn().mockImplementation(() => {
      return {
        matches: true,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn()
      }
    })

    // Repsonsive Query Mock Default
    responsiveQuerySizes.mockImplementation(() => ({
      desktop: {minWidth: '768px'}
    }))
  })
  beforeEach(() => {
    window.document.getSelection = () => {
      return {
        removeAllRanges: () => {}
      }
    }
  })

  it('renders the provided conversations', () => {
    const {getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversations = getAllByTestId('conversation')
    expect(conversations.length).toBe(5)
  })

  it('should be able to select conversations', () => {
    const {getAllByText, getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversation = getAllByText('This is a different subject line')
    fireEvent.click(conversation[0])
    const checkboxes = getAllByTestId('conversationListItem-Checkbox')
    expect(checkboxes.filter(c => c.checked === true).length).toBe(1)
  })

  it('Sets the selected conversation as the conversation not the conversation participant', () => {
    const onSelect = jest.fn()
    const {getAllByText} = render(<ConversationListHolder {...props} onSelect={onSelect} />)
    const conversation = getAllByText('This is a different subject line')
    fireEvent.click(conversation[0])
    const expectedConversation = props.conversations[1].conversation
    expect(onSelect).toHaveBeenCalledWith([expectedConversation])
  })

  it('should be able to open conversations', () => {
    const onOpenMock = jest.fn()
    const {getAllByText} = render(<ConversationListHolder onOpen={onOpenMock} {...props} />)
    const conversation = getAllByText('This is a different subject line')
    fireEvent.click(conversation[0])
    expect(onOpenMock).toHaveBeenCalled()
  })

  it('should be able to select multiple conversations using cmd key', () => {
    const {getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversations = getAllByTestId('conversationListItem-Item')
    fireEvent.click(conversations[0])
    fireEvent.click(conversations[1], {
      metaKey: true
    })
    fireEvent.click(conversations[2], {
      metaKey: true
    })
    const checkboxes = getAllByTestId('conversationListItem-Checkbox')
    expect(checkboxes.filter(c => c.checked === true).length).toBe(3)
  })

  it('should be able to select multiple conversations using crtl key', () => {
    const {getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversations = getAllByTestId('conversationListItem-Item')
    fireEvent.click(conversations[1])
    fireEvent.click(conversations[3], {
      ctrlKey: true
    })
    fireEvent.click(conversations[4], {
      ctrlKey: true
    })
    const checkboxes = getAllByTestId('conversationListItem-Checkbox')
    expect(checkboxes.filter(c => c.checked === true).length).toBe(3)
  })

  it('should be able to select range of conversations ASC', () => {
    const {getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversations = getAllByTestId('conversationListItem-Item')
    fireEvent.click(conversations[0])
    fireEvent.click(conversations[3], {
      shiftKey: true
    })
    const checkboxes = getAllByTestId('conversationListItem-Checkbox')
    expect(checkboxes.filter(c => c.checked === true).length).toBe(4)
  })

  it('should be able to select range of conversations DESC', () => {
    const {getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversations = getAllByTestId('conversationListItem-Item')
    fireEvent.click(conversations[3])
    fireEvent.click(conversations[1], {
      shiftKey: true
    })
    const checkboxes = getAllByTestId('conversationListItem-Checkbox')
    expect(checkboxes.filter(c => c.checked === true).length).toBe(3)
  })

  it('should unselect multi select when conversation opened', () => {
    const {getAllByTestId} = render(<ConversationListHolder {...props} />)
    const conversations = getAllByTestId('conversationListItem-Item')
    fireEvent.click(conversations[0])
    fireEvent.click(conversations[1], {
      metaKey: true
    })
    fireEvent.click(conversations[2], {
      metaKey: true
    })
    fireEvent.click(conversations[4])
    const checkboxes = getAllByTestId('conversationListItem-Checkbox')
    expect(checkboxes.filter(c => c.checked === true).length).toBe(1)
  })
})
