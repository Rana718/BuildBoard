'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditCard, DollarSign, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { projectsAPI, paymentsAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['card', 'paypal', 'bank_transfer']),
  cardNumber: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvv: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface Project {
  id: string;
  title: string;
  description: string;
  budgetRange: string;
  finalAmount?: number;
  status: string;
  seller: {
    id: string;
    name: string;
    profileImageUrl?: string;
    averageRating: number;
  };
  buyer: {
    id: string;
    name: string;
  };
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
    },
  });

  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(projectId);
      const projectData = response.data;
      
      if (projectData.status !== 'COMPLETED') {
        router.push(`/projects/${projectId}`);
        return;
      }

      if (projectData.buyerId !== user?.id) {
        router.push('/dashboard');
        return;
      }

      setProject(projectData);
      
      // Set suggested amount based on budget range or final amount
      const suggestedAmount = projectData.finalAmount || 
        parseFloat(projectData.budgetRange.replace(/[^0-9.-]+/g, '')) || 0;
      setValue('amount', suggestedAmount);
      
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setProcessing(true);
      setPaymentError('');

      // Create payment
      const paymentResponse = await paymentsAPI.create({
        projectId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
      });

      const payment = paymentResponse.data;

      // Process payment
      const processResponse = await paymentsAPI.process(payment.id, {
        paymentMethod: data.paymentMethod,
        cardDetails: data.paymentMethod === 'card' ? {
          number: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
        } : undefined,
      });

      if (processResponse.data.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setPaymentError(processResponse.data.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Project not found or not accessible</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully. You will be redirected to your dashboard shortly.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Payment</h1>
          <p className="text-gray-600">Complete payment for your project</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Project Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
              </div>

              <Separator />

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={project.seller.profileImageUrl} />
                  <AvatarFallback>
                    {project.seller.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{project.seller.name}</p>
                  <p className="text-sm text-gray-500">Seller</p>
                </div>
                <Badge variant="secondary">
                  ⭐ {project.seller.averageRating.toFixed(1)}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Budget Range:</span>
                  <span className="font-medium">{project.budgetRange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Details</span>
              </CardTitle>
              <CardDescription>
                Enter your payment information to complete the transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value:any) => setValue('paymentMethod', value as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...register('cardNumber')}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth">Month</Label>
                        <Input
                          id="expiryMonth"
                          placeholder="MM"
                          maxLength={2}
                          {...register('expiryMonth')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryYear">Year</Label>
                        <Input
                          id="expiryYear"
                          placeholder="YY"
                          maxLength={2}
                          {...register('expiryYear')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          maxLength={4}
                          {...register('cvv')}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Info */}
                {paymentMethod === 'paypal' && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <p className="text-sm text-green-800">
                      Bank transfer details will be provided after confirmation.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {paymentError && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-600">{paymentError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay $${watch('amount') || 0}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your payment information is secure and encrypted. This is a demo payment system.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
