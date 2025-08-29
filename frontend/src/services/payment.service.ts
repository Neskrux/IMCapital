const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? window.location.origin 
    : 'http://localhost:3001'
);

export interface PaymentResponse {
  success: boolean;
  payment: {
    id: string;
    client_secret: string;
    status: string;
    amount: number;
  };
}

export interface PaymentStatus {
  id: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  amount: number;
  payment_method: string;
}

class PaymentService {
  async createPixPayment(amount: number, userId: string, userEmail?: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/payments/pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          userId,
          userEmail,
          description: `Depósito via PIX - ${new Date().toLocaleDateString('pt-BR')}`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar pagamento PIX');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw error;
    }
  }

  async createCardPayment(amount: number, userId: string, userEmail?: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/payments/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          userId,
          userEmail,
          description: `Depósito via Cartão - ${new Date().toLocaleDateString('pt-BR')}`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar pagamento com cartão');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar pagamento com cartão:', error);
      throw error;
    }
  }

  async confirmPixPayment(paymentIntentId: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/payments/${paymentIntentId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao confirmar pagamento PIX');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao confirmar pagamento PIX:', error);
      throw error;
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${API_URL}/api/payments/${paymentId}/status`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw error;
    }
  }

  // Polling para verificar status do pagamento
  startPaymentStatusPolling(
    paymentId: string, 
    onStatusUpdate: (status: PaymentStatus) => void,
    intervalMs: number = 5000
  ): () => void {
    const interval = setInterval(async () => {
      try {
        const status = await this.checkPaymentStatus(paymentId);
        onStatusUpdate(status);
        
        // Parar polling se pagamento foi finalizado
        if (['succeeded', 'canceled'].includes(status.status)) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, intervalMs);

    // Retornar função para parar o polling
    return () => clearInterval(interval);
  }
}

export default new PaymentService();