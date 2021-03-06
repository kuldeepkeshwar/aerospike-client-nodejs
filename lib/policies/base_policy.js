// *****************************************************************************
// Copyright 2013-2017 Aerospike, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// *****************************************************************************

'use strict'

/**
 * Base class for all client policies. The base policy defines general policy
 * values that are supported by all client policies, including timeout and
 * retry handling.
 *
 * @since v3.0.0
 */
class BasePolicy {
  /**
   * @private
   */
  constructor (props) {
    props = props || {}

    /**
     * Socket idle timeout in milliseconds when processing a database command.
     *
     * If <code>socketTimeout</code> is not zero and the socket has been idle
     * for at least <code>socketTimeout</code>, both <code>maxRetries</code>
     * and <code>totalTimeout</code> are checked. If <code>maxRetries</code>
     * and <code>totalTimeout</code> are not exceeded, the transaction is
     * retried.
     *
     * If both <code>socketTimeout</code> and <code>totalTimeout</code> are
     * non-zero and <code>socketTimeout</code> > <code>totalTimeout</code>,
     * then <code>socketTimeout</code> will be set to
     * <code>totalTimeout</code>. If <code>socketTimeout</code> is zero, there
     * will be no socket idle limit.
     *
     * @type number
     * @default 0 (no socket idle time limit).
     */
    this.socketTimeout = props['socketTimeout']

    /**
     * Total transaction timeout in milliseconds.
     *
     * The <code>totalTimeout</code> is tracked on the client and sent to the
     * server along with the transaction in the wire protocol. The client will
     * most likely timeout first, but the server also has the capability to
     * timeout the transaction.
     *
     * If <code>totalTimeout</code> is not zero and <code>totalTimeout</code>
     * is reached before the transaction completes, the transaction will return
     * error {@link module:aerospike/status.ERR_TIMEOUT|ERR_TIMEOUT}.
     * If <code>totalTimeout</code> is zero, there will be no total time limit.
     *
     * @type number
     * @default 1000
     */
    this.totalTimeout = props['totalTimeout']
    if (this.totalTimeout === undefined) {
      this.totalTimeout = props['timeout']
    }

    /**
     * Maximum number of retries before aborting the current transaction.
     * The initial attempt is not counted as a retry.
     *
     * If <code>maxRetries</code> is exceeded, the transaction will return
     * error {@link module:aerospike/status.ERR_TIMEOUT|ERR_TIMEOUT}.
     *
     * WARNING: Database writes that are not idempotent (such as "add")
     * should not be retried because the write operation may be performed
     * multiple times if the client timed out previous transaction attempts.
     * It is important to use a distinct write policy for non-idempotent
     * writes which sets <code>maxRetries</code> to zero.
     *
     * @type number
     * @default: 2 (initial attempt + 2 retries = 3 attempts)
     */
    this.maxRetries = props['maxRetries']
  }
}

module.exports = BasePolicy
