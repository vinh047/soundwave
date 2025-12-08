"use client";

import { Button } from "@/components/ui2/Button";
import { Cloud, Lock } from "lucide-react";
import { useState } from "react";
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaPaypal } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa6";

export default function ArtistCheckoutPage() {
    const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

    const yearlyPrice = 1140000;
    const monthlyPrice = 185000;
    const yearlyMonthlyEquivalent = 95000;

    const renewalDate = new Date();
    if (billingCycle === "yearly") {
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    } else {
        renewalDate.setMonth(renewalDate.getMonth() + 1);
    }

    const formattedRenewalDate = renewalDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-white pb-20 pt-10 text-gray-900 dark:bg-[#121212] dark:text-white">
            <div className="mx-auto max-w-6xl px-4 md:px-8">
                <div className="mb-8 flex items-center gap-2">
                    <Cloud className="h-8 w-8 text-orange-500" fill="currentColor" />
                </div>

                <h1 className="mb-8 text-3xl font-bold">Get Artist Pro</h1>

                <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
                    {/* Left Column */}
                    <div className="space-y-10">
                        {/* 1. Billing cycle */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold">1. Billing cycle</h2>
                            <div className="space-y-4">
                                {/* Yearly Option */}
                                <label
                                    className={`relative flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all ${billingCycle === "yearly"
                                            ? "border-orange-500 ring-1 ring-orange-500"
                                            : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="billing"
                                            value="yearly"
                                            checked={billingCycle === "yearly"}
                                            onChange={() => setBillingCycle("yearly")}
                                            className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div>
                                            <div className="font-bold">Yearly billing</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ₫{yearlyPrice.toLocaleString()}, that's ₫{yearlyMonthlyEquivalent.toLocaleString()}/month
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-orange-500 px-2 py-1 text-xs font-bold text-white uppercase rounded">
                                        49% Yearly Discount
                                    </div>
                                </label>

                                {/* Monthly Option */}
                                <label
                                    className={`relative flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all ${billingCycle === "monthly"
                                            ? "border-orange-500 ring-1 ring-orange-500"
                                            : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="billing"
                                            value="monthly"
                                            checked={billingCycle === "monthly"}
                                            onChange={() => setBillingCycle("monthly")}
                                            className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div>
                                            <div className="font-bold">Monthly billing</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ₫{monthlyPrice.toLocaleString()}/month
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </section>

                        {/* 2. Payment details */}
                        <section>
                            <div className="mb-4 flex items-center gap-2">
                                <h2 className="text-xl font-bold">2. Payment details</h2>
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="mb-4 font-medium">Add new payment methods</p>

                            <div className="space-y-4">
                                {/* Card Option */}
                                <label
                                    className={`relative flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all ${paymentMethod === "card"
                                            ? "border-orange-500 ring-1 ring-orange-500"
                                            : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={() => setPaymentMethod("card")}
                                            className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div className="font-bold">Card</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-2xl text-gray-600 dark:text-gray-400">
                                        <FaCcVisa />
                                        <FaCcMastercard />
                                        <FaCcAmex />
                                        <FaCreditCard />
                                    </div>
                                </label>

                                {/* PayPal Option */}
                                <label
                                    className={`relative flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all ${paymentMethod === "paypal"
                                            ? "border-orange-500 ring-1 ring-orange-500"
                                            : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === "paypal"}
                                            onChange={() => setPaymentMethod("paypal")}
                                            className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div className="font-bold">PayPal</div>
                                    </div>
                                    <div className="text-2xl text-[#003087]">
                                        <FaPaypal />
                                    </div>
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Review */}
                    <div>
                        <h2 className="mb-4 text-xl font-bold">3. Review your purchase</h2>
                        <div className="bg-gray-50 p-6 rounded-md dark:bg-zinc-900">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-black p-2 rounded text-white">
                                    <Cloud size={24} fill="currentColor" />
                                </div>
                                <span className="font-bold text-lg">Artist Pro</span>
                            </div>

                            <a href="#" className="text-sm text-blue-600 hover:underline mb-6 block">Do you have a coupon code?</a>

                            <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-xl">
                                        ₫{billingCycle === "yearly" ? yearlyPrice.toLocaleString() : monthlyPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Billing cycle</span>
                                    <span>{billingCycle === "yearly" ? "Yearly" : "Monthly"}</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-4 mb-6 leading-relaxed">
                                Subscription will automatically renew at ₫{billingCycle === "yearly" ? yearlyPrice.toLocaleString() : monthlyPrice.toLocaleString()} every {billingCycle === "yearly" ? "year" : "month"}, starting {formattedRenewalDate}, unless you cancel before the day of your next renewal in your subscription settings.
                                <br /><br />
                                All prices in VND
                            </p>

                            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-6 rounded-md">
                                Buy subscription
                            </Button>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                            By submitting your payment information and clicking Buy subscription you agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Use for Artist Subscriptions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
