<?php

namespace App\Helpers;

class NumberToWordsHelper
{
    /**
     * Convert a numeric amount into Bangladeshi Taka words format.
     * Example: 20600.00 => "Twenty Thousand Six Hundred Taka Only"
     */
    public static function toWords(float|int $amount, string $currency = 'Taka'): string
    {
        $amount = round($amount, 2);
        $parts = explode('.', number_format($amount, 2, '.', ''));
        $integerPart = (int) $parts[0];
        $fractionPart = (int) ($parts[1] ?? 0);

        if ($integerPart === 0 && $fractionPart === 0) {
            return "Zero {$currency} Only";
        }

        $words = self::convertNumberToWords($integerPart);
        $result = $words ? trim($words) . " {$currency}" : '';

        if ($fractionPart > 0) {
            $paisaWords = self::convertNumberToWords($fractionPart);
            $result .= ($result ? " and " : "") . trim($paisaWords) . " Paisa";
        }

        return ucwords(strtolower(trim($result))) . " Only";
    }

    private static function convertNumberToWords(int $num): string
    {
        if ($num < 0) {
            return 'Minus ' . self::convertNumberToWords(abs($num));
        }

        if ($num === 0) {
            return '';
        }

        $ones = [
            1 => 'One', 2 => 'Two', 3 => 'Three', 4 => 'Four', 5 => 'Five',
            6 => 'Six', 7 => 'Seven', 8 => 'Eight', 9 => 'Nine', 10 => 'Ten',
            11 => 'Eleven', 12 => 'Twelve', 13 => 'Thirteen', 14 => 'Fourteen',
            15 => 'Fifteen', 16 => 'Sixteen', 17 => 'Seventeen', 18 => 'Eighteen',
            19 => 'Nineteen',
        ];

        $tens = [
            2 => 'Twenty', 3 => 'Thirty', 4 => 'Forty', 5 => 'Fifty',
            6 => 'Sixty', 7 => 'Seventy', 8 => 'Eighty', 9 => 'Ninety',
        ];

        // Bangladeshi / Indian numbering scale: Crore (10,000,000), Lakh (100,000), Thousand (1,000), Hundred (100)
        $crore = floor($num / 10000000);
        $remainder = $num % 10000000;

        $lakh = floor($remainder / 100000);
        $remainder = $remainder % 100000;

        $thousand = floor($remainder / 1000);
        $remainder = $remainder % 1000;

        $hundred = floor($remainder / 100);
        $remainder = $remainder % 100;

        $output = '';

        if ($crore > 0) {
            $output .= self::convertNumberToWords((int) $crore) . ' Crore ';
        }

        if ($lakh > 0) {
            $output .= self::convertNumberToWords((int) $lakh) . ' Lakh ';
        }

        if ($thousand > 0) {
            $output .= self::convertNumberToWords((int) $thousand) . ' Thousand ';
        }

        if ($hundred > 0) {
            $output .= self::convertNumberToWords((int) $hundred) . ' Hundred ';
        }

        if ($remainder > 0) {
            if ($remainder < 20) {
                $output .= $ones[$remainder] . ' ';
            } else {
                $tenVal = (int) floor($remainder / 10);
                $unitVal = $remainder % 10;
                $output .= $tens[$tenVal] . ' ';
                if ($unitVal > 0) {
                    $output .= $ones[$unitVal] . ' ';
                }
            }
        }

        return trim($output);
    }
}
