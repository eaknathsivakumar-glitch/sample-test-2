/**
 * PaymentsPage - Page Object Model for Payments API endpoints
 */
class PaymentsPage {
  constructor(page) {
    this.page = page;
    this.baseURL = '/api/v1';
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Response from API
   */
  async createPayment(paymentData) {
    const response = await this.page.request.post(`${this.baseURL}/payments`, {
      data: paymentData,
    });
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Response from API
   */
  async getPayment(paymentId) {
    const response = await this.page.request.get(`${this.baseURL}/payments/${paymentId}`);
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Get all payments
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} Response from API
   */
  async getAllPayments(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${this.baseURL}/payments?${queryParams}` : `${this.baseURL}/payments`;
    const response = await this.page.request.get(url);
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Update a payment
   * @param {string} paymentId - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Response from API
   */
  async updatePayment(paymentId, updateData) {
    const response = await this.page.request.put(`${this.baseURL}/payments/${paymentId}`, {
      data: updateData,
    });
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Delete a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Response from API
   */
  async deletePayment(paymentId) {
    const response = await this.page.request.delete(`${this.baseURL}/payments/${paymentId}`);
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Process a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Response from API
   */
  async processPayment(paymentId) {
    const response = await this.page.request.post(`${this.baseURL}/payments/${paymentId}/process`);
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Refund a payment
   * @param {string} paymentId - Payment ID
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Response from API
   */
  async refundPayment(paymentId, refundData = {}) {
    const response = await this.page.request.post(`${this.baseURL}/payments/${paymentId}/refund`, {
      data: refundData,
    });
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Validate payment data
   * @param {Object} paymentData - Payment data to validate
   * @returns {Promise<Object>} Response from API
   */
  async validatePayment(paymentData) {
    const response = await this.page.request.post(`${this.baseURL}/payments/validate`, {
      data: paymentData,
    });
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }

  /**
   * Get payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Response from API
   */
  async getPaymentStatus(paymentId) {
    const response = await this.page.request.get(`${this.baseURL}/payments/${paymentId}/status`);
    return {
      status: response.status(),
      data: await response.json().catch(() => null),
    };
  }
}

module.exports = PaymentsPage;
