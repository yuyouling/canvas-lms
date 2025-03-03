# frozen_string_literal: true

#
# Copyright (C) 2021 - present Instructure, Inc.
#
# This file is part of Canvas.
#
# Canvas is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3 of the License.
#
# Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
# A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License along
# with this program. If not, see <http://www.gnu.org/licenses/>.

require_relative "../../common"

module DashboardPage
  #------------------------- Selectors --------------------------
  def card_container_selector
    "#DashboardCard_Container"
  end

  def dashboard_container_selector
    "#dashboard"
  end

  #------------------------- Elements --------------------------
  def card_container
    f(card_container_selector)
  end

  def dashboard_container
    f(dashboard_container_selector)
  end
end
