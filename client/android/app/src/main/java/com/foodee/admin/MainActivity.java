package com.foodee.admin;

import com.getcapacitor.BridgeActivity;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.webkit.WebView;
import android.view.ViewGroup.LayoutParams;
import android.view.View;
import android.view.Gravity;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        
        // Đợi view được tạo xong
        View contentView = findViewById(android.R.id.content);
        contentView.post(() -> {
            WebView webView = getBridge().getWebView();
            
            // Scale content lên 150%
            webView.setInitialScale(140);
            
            // Set width 100% của màn hình
            CoordinatorLayout.LayoutParams params = new CoordinatorLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
            );
            
            webView.setLayoutParams(params);
        });
    }
}
