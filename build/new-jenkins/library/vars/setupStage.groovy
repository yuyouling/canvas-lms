/*
 * Copyright (C) 2021 - present Instructure, Inc.
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

def call() {
  def refspecToCheckout = env.GERRIT_PROJECT == 'canvas-lms' ? env.GERRIT_REFSPEC : env.CANVAS_LMS_REFSPEC
  checkoutRepo('canvas-lms', refspecToCheckout, 100)

  if (env.GERRIT_PROJECT != 'canvas-lms') {
    dir(env.LOCAL_WORKDIR) {
      checkoutRepo(GERRIT_PROJECT, env.GERRIT_REFSPEC, 2)
    }

    // Plugin builds using the dir step above will create this @tmp file, we need to remove it
    // https://issues.jenkins.io/browse/JENKINS-52750
    sh "rm -vrf ${env.LOCAL_WORKDIR}@tmp"
  }

  gems = configuration.plugins()
  echo "Plugin list: ${gems}"
  def pluginsToPull = []
  gems.each { gem ->
    if (env.GERRIT_PROJECT != gem) {
      pluginsToPull.add([name: gem, version: _getPluginVersion(gem), target: "gems/plugins/$gem"])
    }
  }

  if (env.GERRIT_PROJECT != 'qti_migration_tool') {
    pluginsToPull.add([name: 'qti_migration_tool', version: _getPluginVersion('qti_migration_tool'), target: 'vendor/qti_migration_tool'])
  }

  pullRepos(pluginsToPull)
  echo 'Pulling Crystalball Map'
  _getCrystalballMap()
  libraryScript.load('bash/docker-tag-remote.sh', './build/new-jenkins/docker-tag-remote.sh')
}

def _getCrystalballMap() {
  withCredentials([usernamePassword(credentialsId: 'INSENG_CANVAS_CI_AWS_ACCESS', usernameVariable: 'INSENG_AWS_ACCESS_KEY_ID', passwordVariable: 'INSENG_AWS_SECRET_ACCESS_KEY')]) {
    def awsCreds = "AWS_DEFAULT_REGION=us-west-2 AWS_ACCESS_KEY_ID=${INSENG_AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${INSENG_AWS_SECRET_ACCESS_KEY}"
    sh "$awsCreds aws s3 cp s3://instructure-canvas-ci/crystalball_map.yml ."
  }
}

def _getPluginVersion(plugin) {
  if (env.GERRIT_BRANCH.contains('stable/')) {
    return configuration.getString("pin-commit-$plugin", env.GERRIT_BRANCH)
  }
  return env.GERRIT_EVENT_TYPE == 'change-merged' ? 'master' : configuration.getString("pin-commit-$plugin", 'master')
}
