"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUpload } from "@/components/FileUpload"
import { projectsAPI, bidsAPI, reviewsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Calendar, DollarSign, Users, Star, Upload, CheckCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ProjectFullData } from "@/types"

const bidSchema = z.object({
  bidAmount: z.number().positive("Bid amount must be positive"),
  estimatedCompletionTime: z.string().min(1, "Estimated completion time is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").optional(),
})

type BidForm = z.infer<typeof bidSchema>
type ReviewForm = z.infer<typeof reviewSchema>



export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState<ProjectFullData | null>(null)
  const [loading, setLoading] = useState(true)
  const [bidding, setBidding] = useState(false)
  const [showBidForm, setShowBidForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [deliverableUrl, setDeliverableUrl] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const bidForm = useForm<BidForm>({
    resolver: zodResolver(bidSchema),
  })

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
  })

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(id as string)
      setProject(response.data.project)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch project details",
        variant: "error",
      })
      router.push("/projects")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceBid = async (data: BidForm) => {
    setBidding(true)
    try {
      await bidsAPI.place({
        projectId: id as string,
        ...data,
      })

      toast({
        title: "Bid placed successfully",
        description: "Your bid has been submitted to the buyer.",
      })

      setShowBidForm(false)
      bidForm.reset()
      fetchProject()
    } catch (error: any) {
      toast({
        title: "Failed to place bid",
        description: error.response?.data?.message || "An error occurred",
        variant: "error",
      })
    } finally {
      setBidding(false)
    }
  }

  const handleSelectSeller = async (sellerId: string) => {
    try {
      await projectsAPI.selectSeller(id as string, sellerId)
      toast({
        title: "Seller selected",
        description: "The seller has been notified and the project is now in progress.",
      })
      fetchProject()
    } catch (error: any) {
      toast({
        title: "Failed to select seller",
        description: error.response?.data?.message || "An error occurred",
        variant: "error",
      })
    }
  }

  const handleCompleteProject = async () => {
    try {
      await projectsAPI.complete(id as string)
      toast({
        title: "Project completed",
        description: "The project has been marked as completed and the buyer has been notified.",
      })
      fetchProject()
    } catch (error: any) {
      toast({
        title: "Failed to complete project",
        description: error.response?.data?.message || "An error occurred",
        variant: "error",
      })
    }
  }

  const handleUploadDeliverable = async () => {
    if (!deliverableUrl) {
      toast({
        title: "No file selected",
        description: "Please upload a file first.",
        variant: "error",
      })
      return
    }

    try {
      await projectsAPI.uploadDeliverable(id as string, deliverableUrl)
      toast({
        title: "Deliverable uploaded",
        description: "Your deliverable has been uploaded successfully.",
      })
      setDeliverableUrl("")
      fetchProject()
    } catch (error: any) {
      toast({
        title: "Failed to upload deliverable",
        description: error.response?.data?.message || "An error occurred",
        variant: "error",
      })
    }
  }

  const handleSubmitReview = async (data: ReviewForm) => {
    try {
      await reviewsAPI.create(id as string, data)
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })
      setShowReviewForm(false)
      reviewForm.reset()
      fetchProject()
    } catch (error: any) {
      toast({
        title: "Failed to submit review",
        description: error.response?.data?.message || "An error occurred",
        variant: "error",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30"
      case "COMPLETED":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }
  }

  const canPlaceBid =
    user?.role === "SELLER" &&
    project?.status === "PENDING" &&
    project?.buyer.id !== user?.id &&
    !project?.bids.some((bid) => bid.seller.id === user?.id)

  const canSelectSeller = user?.role === "BUYER" && project?.buyer.id === user?.id && project?.status === "PENDING"

  const canCompleteProject =
    user?.role === "SELLER" && project?.seller?.id === user?.id && project?.status === "IN_PROGRESS"

  const canUploadDeliverable =
    user?.role === "SELLER" && project?.seller?.id === user?.id && project?.status === "IN_PROGRESS"

  const canReview =
    user?.role === "BUYER" &&
    project?.buyer.id === user?.id &&
    project?.status === "COMPLETED" &&
    project?.reviews.length === 0

  const canMakePayment = user?.role === "BUYER" && project?.buyer.id === user?.id && project?.status === "COMPLETED"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Project not found</p>
          <Button onClick={() => router.push("/projects")} className="mt-4" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{project.title}</h1>
            <Badge className={`${getStatusColor(project.status)} text-xs`}>{project.status.replace("_", " ")}</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Project Header - Desktop */}
            <Card className="hidden lg:block bg-card border-border shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl xl:text-3xl mb-3 text-card-foreground pr-4">
                      {project.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                      <Badge className={`${getStatusColor(project.status)} font-medium border`}>
                        {project.status.replace("_", " ")}
                      </Badge>
                      <span className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {format(new Date(project.deadline), "MMM dd, yyyy")}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {project.budgetRange}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {project.bids.length} bids
                      </span>
                    </div>
                  </div>
                </div>
                {project.imageUrl && (
                  <div className="relative h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-card-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Header - Mobile */}
            <Card className="lg:hidden bg-card border-border shadow-lg">
              <CardContent className="p-4">
                {project.imageUrl && (
                  <div className="relative h-48 rounded-lg overflow-hidden border border-border mb-4">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="truncate">{format(new Date(project.deadline), "MMM dd")}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="truncate">{project.budgetRange}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{project.bids.length} bids</span>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-card-foreground whitespace-pre-wrap leading-relaxed text-sm">
                      {project.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg md:text-xl text-card-foreground">
                    Bids ({project.bids.length})
                  </CardTitle>
                  {canPlaceBid && (
                    <Button
                      onClick={() => setShowBidForm(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                      size="sm"
                    >
                      Place Bid
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showBidForm && (
                  <div className="mb-6 p-4 md:p-6 border border-border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-4 text-foreground">Submit Your Bid</h4>
                    <form onSubmit={bidForm.handleSubmit(handlePlaceBid)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Bid Amount ($)</label>
                          <Input
                            type="number"
                            step="0.01"
                            {...bidForm.register("bidAmount", { valueAsNumber: true })}
                            className={`bg-background border-input text-foreground ${bidForm.formState.errors.bidAmount ? "border-destructive" : ""}`}
                          />
                          {bidForm.formState.errors.bidAmount && (
                            <p className="text-destructive text-sm mt-1">
                              {bidForm.formState.errors.bidAmount.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Completion Time</label>
                          <Input
                            placeholder="e.g., 2 weeks, 1 month"
                            {...bidForm.register("estimatedCompletionTime")}
                            className={`bg-background border-input text-foreground ${bidForm.formState.errors.estimatedCompletionTime ? "border-destructive" : ""}`}
                          />
                          {bidForm.formState.errors.estimatedCompletionTime && (
                            <p className="text-destructive text-sm mt-1">
                              {bidForm.formState.errors.estimatedCompletionTime.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Proposal Message</label>
                        <Textarea
                          rows={4}
                          placeholder="Explain your approach, experience, and why you're the right fit for this project..."
                          {...bidForm.register("message")}
                          className={`bg-background border-input text-foreground ${bidForm.formState.errors.message ? "border-destructive" : ""}`}
                        />
                        {bidForm.formState.errors.message && (
                          <p className="text-destructive text-sm mt-1">{bidForm.formState.errors.message.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="submit"
                          disabled={bidding}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
                        >
                          {bidding ? "Submitting..." : "Submit Bid"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowBidForm(false)}
                          className="border-border hover:bg-accent flex-1 sm:flex-none"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {project.bids.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bids yet</p>
                ) : (
                  <div className="space-y-4">
                    {project.bids.map((bid) => (
                      <div key={bid.id} className="border border-border rounded-lg p-4 bg-card/50">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={bid.seller.profileImageUrl || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                {bid.seller.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-foreground truncate">{bid.seller.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(bid.createdAt), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="text-right sm:text-left flex-shrink-0">
                            <div className="text-lg font-bold text-green-600">${bid.bidAmount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{bid.estimatedCompletionTime}</div>
                          </div>
                        </div>
                        <p className="text-foreground mb-3 leading-relaxed text-sm md:text-base">{bid.message}</p>
                        {canSelectSeller && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectSeller(bid.seller.id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                          >
                            Select This Seller
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deliverables Section */}
            {(project.status === "IN_PROGRESS" || project.status === "COMPLETED") && (
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-card-foreground">Deliverables</CardTitle>
                  {canUploadDeliverable && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30">
                        <FileUpload onUpload={setDeliverableUrl} accept="*/*" maxSize={50 * 1024 * 1024} />
                      </div>
                      {deliverableUrl && (
                        <Button
                          onClick={handleUploadDeliverable}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Deliverable
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {project.deliverables.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No deliverables uploaded yet</p>
                  ) : (
                    <div className="space-y-3">
                      {project.deliverables.map((deliverable) => (
                        <div
                          key={deliverable.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-border rounded-lg bg-card/50"
                        >
                          <div>
                            <p className="font-medium text-foreground">Deliverable</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded {format(new Date(deliverable.uploadedAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-border hover:bg-accent w-full sm:w-auto"
                          >
                            <a href={deliverable.fileUrl} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            {project.status === "COMPLETED" && (
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <CardTitle className="text-lg md:text-xl text-card-foreground">Review</CardTitle>
                    {canReview && (
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                        size="sm"
                      >
                        Leave Review
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {showReviewForm && (
                    <div className="mb-6 p-4 md:p-6 border border-border rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-4 text-foreground">Rate Your Experience</h4>
                      <form onSubmit={reviewForm.handleSubmit(handleSubmitReview)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Rating (1-5 stars)</label>
                          <select
                            {...reviewForm.register("rating", { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          >
                            <option value="">Select rating</option>
                            <option value={1}>1 Star</option>
                            <option value={2}>2 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={5}>5 Stars</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Comment (Optional)</label>
                          <Textarea
                            rows={4}
                            placeholder="Share your experience working with this seller..."
                            {...reviewForm.register("comment")}
                            className="bg-background border-input text-foreground"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
                          >
                            Submit Review
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowReviewForm(false)}
                            className="border-border hover:bg-accent flex-1 sm:flex-none"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {project.reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No reviews yet</p>
                  ) : (
                    <div className="space-y-4">
                      {project.reviews.map((review) => (
                        <div key={review.id} className="border border-border rounded-lg p-4 bg-card/50">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={review.buyer.profileImageUrl || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                {review.buyer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h4 className="font-semibold text-foreground truncate">{review.buyer.name}</h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-muted-foreground"}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                                  </span>
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-foreground leading-relaxed text-sm md:text-base">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payment Section */}
            {canMakePayment && (
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-card-foreground">
                    <DollarSign className="h-5 w-5" />
                    <span>Payment</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Complete payment for this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Project Completed</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        The seller has completed the project. You can now proceed with payment.
                      </p>
                    </div>

                    <Button
                      onClick={() => router.push(`/payments/${project.id}`)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Make Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Posted by</h4>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={project.buyer.profileImageUrl || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {project.buyer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground font-medium truncate">{project.buyer.name}</span>
                  </div>
                </div>

                {project.seller && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Assigned to</h4>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={project.seller.profileImageUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {project.seller.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground font-medium truncate">{project.seller.name}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Posted</h4>
                    <p className="text-muted-foreground text-sm">
                      {format(new Date(project.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Budget</h4>
                    <p className="text-muted-foreground text-sm">{project.budgetRange}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Deadline</h4>
                    <p className="text-muted-foreground text-sm">
                      {format(new Date(project.deadline), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {canCompleteProject && (
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Project Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleCompleteProject}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
