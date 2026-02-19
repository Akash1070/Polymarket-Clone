'use client'
// Marks this component as a Client Component in Next.js App Router
// Required because we use hooks and browser-only features

import { useReadContract } from 'thirdweb/react'
// Hook to read data from a smart contract (read-only calls)

import { contract } from '@/constants/contract'
// Pre-configured contract instance (address + chain + client)

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// UI components for tab-based navigation

import { MarketCard } from './marketCard'
// Component responsible for rendering a single market

import { Navbar } from './navbar'
// Top navigation bar

import { MarketCardSkeleton } from './market-card-skeleton'
// Loading skeleton shown while data is fetching

import { Footer } from "./footer"
// Footer component shown at the bottom of the page

export function EnhancedPredictionMarketDashboard() {

    // Read total number of markets from the smart contract
    // Calls: marketCount() → uint256
    const { data: marketCount, isLoading: isLoadingMarketCount } = useReadContract({
        contract,
        method: "function marketCount() view returns (uint256)",
        params: []
    }); 

    // Create 6 skeleton cards to display during loading state
    // This keeps the UI visually stable while data loads
    const skeletonCards = Array.from({ length: 6 }, (_, i) => (
        <MarketCardSkeleton key={`skeleton-${i}`} />
    ));

    return (
        // Full-height page layout with footer pinned to bottom
        <div className="min-h-screen flex flex-col">

            {/* Main content area */}
            <div className="flex-grow container mx-auto p-4">

                {/* Top navigation */}
                <Navbar />

                {/* Banner / hero image */}
                <div className="mb-4">
                    <img 
                        src="https://placehold.co/800x300" 
                        alt="Placeholder Banner" 
                        className="w-full h-auto rounded-lg" 
                    />
                </div>

                {/* Tabs for market filtering */}
                <Tabs defaultValue="active" className="w-full">

                    {/* Tab buttons */}
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending Resolution</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    </TabsList>

                    {/* Loading state: show skeleton cards */}
                    {isLoadingMarketCount ? (
                        <TabsContent value="active" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {skeletonCards}
                            </div>
                        </TabsContent>
                    ) : (
                        <>
                            {/* Active markets */}
                            <TabsContent value="active">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Array.from({ length: Number(marketCount) }, (_, index) => (
                                        <MarketCard 
                                            key={index} 
                                            index={index}   // Market ID on-chain
                                            filter="active" // Filter logic handled inside MarketCard
                                        />
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Markets awaiting resolution */}
                            <TabsContent value="pending">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Array.from({ length: Number(marketCount) }, (_, index) => (
                                        <MarketCard 
                                            key={index} 
                                            index={index}
                                            filter="pending"
                                        />
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Resolved markets */}
                            <TabsContent value="resolved">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Array.from({ length: Number(marketCount) }, (_, index) => (
                                        <MarketCard 
                                            key={index} 
                                            index={index}
                                            filter="resolved"
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>

            {/* Sticky footer */}
            <Footer />
        </div>
    );
}
